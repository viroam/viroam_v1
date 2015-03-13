'use strict';
var servicename = 'apartments';

module.exports = function(app) {

    var dependencies = ['$kinvey'];
    var _ = require('lodash');

    function service($kinvey) {
        //il faudra faire une fonction qui permet de rejoindre sa colloc qui a été créé par un pote (le premier) avec un mot de passe ?
        //IL FAUDRA REFAIRE TOUS CES TESTS SANS ACTIF USER THIERRY
        var createApartment = function(longitude, latitude, startDate, endDate, price, videoId) {
            //create an entity in the apartments collection
            //Test: marche
            var user = $kinvey.getActiveUser();
            return $kinvey.DataStore.save('Apartments', {
                _geoloc: [longitude, latitude],
                startDate: startDate,
                endDate: endDate,
                price: price,
                videoApartment: {
                    _type: 'KinveyFile',
                    _id: videoId
                }
            }).then(function(response) {
                user.apartment = response;
                $kinvey.User.update(user, {
                    exclude: ['apartment'],
                    relations: {
                        apartment: 'Apartments'
                    }
                });
            });
        };

        var deleteApartment = function(id) {
            //delete an entity in the apartments collection
            var promise = $kinvey.DataStore.destroy('Apartments', id);
            promise.then(function(response) {
                //console.log('apartment succesfully deleted');
            }, function(error) {
                //console.log('error, apartment failed to be deleted, error :' + error.description);
            });
        };

        var _getApartmentsSeenForActiveUser = function() {
            //renvoi tableau avec tous les apartes (référence vers Apartments) dont le user actif a deja vu la video
            //Test: marche
            var user = $kinvey.getActiveUser();
            var query = new $kinvey.Query();
            query.equalTo('user._id', user._id);
            return $kinvey.DataStore.find('ApartmentsSeenBySearchers', query)
                .then(function(response) {
                    if(response.length === 0) {
                        return [];
                    } else {
                        return response[0].apartments;
                    }
                }, function(error) {});
        };

        var getApartmentsToDisplay = function() {
            //renvoi un tableau avec les apart à afficher sur la map pour le user actif (=ensemble des aparts - aparts vus), tableau de json d'appart
            //Test: marche quand apartseen est vide
            return _getApartmentsSeenForActiveUser().then(function(response) {
                var arrayApartmentsId = [];
                for(var i = 0; i < response.length; i++) {
                    arrayApartmentsId.push(response[i]._id);
                }
                var query = new $kinvey.Query();
                query.notContainedIn('_id', arrayApartmentsId);
                return $kinvey.DataStore.find('Apartments', query);
            });
        };

        var getChatConversionsForSearchers = function() {
            //TEST ATTENTION LE AND NE MARCHE PAS NON PLUS
            //Doit être appellé dans le splashscreen
            //Doit être appelé une nouvelle fois lorsque le searcher click sur "Introduce me"
            //Renvoi le tableau des appartements auxquels notre searcher (active user) a postulé
            var user = $kinvey.getActiveUser();
            var query = new $kinvey.Query();
            query.equalTo('user._id', user._id);
            query.fields(['apartments']);
            // var query2 = new $kinvey.Query();
            // query2.fields(['apartments']);
            // var query = new $kinvey.Query();
            // query = query1.and().query2;
            return $kinvey.DataStore.find('Applicants', query);
        };

        var getArrayOfApartmentsInCircleForSearchers = function(longitude, latitude, radius) {
            // renvoie un tableau d'appartements qui est dans le cercle pour le searcher. Cette fonction est appellée lors du click sur le pinpoint
            //Test: marche si on a pas d'appartements vus
            return _getApartmentsSeenForActiveUser().then(function(response) {
                var arrayApartmentsSeenId = [];
                for(var i = 0; i < response.length; i++) {
                    arrayApartmentsSeenId.push(response[i]._id);
                }
                // var query1 = new $kinvey.Query();
                // query1.notContainedIn('_id', arrayApartmentsSeenId);
                var query2 = new $kinvey.Query();
                query2.near('_geoloc', [longitude, latitude], radius);
                query2.notContainedIn('_id', arrayApartmentsSeenId);
                // query3 = query1.and().query2;
                // // query1.and(query2);
                //A CONTINUER DEMAIN AVEC LES DEUX QUERIES
                return $kinvey.DataStore.find('Apartments', query2);
            });
        };

        var getApartmentsSeenBySearchersEntity = function() {
            //renvoi l'entité (un json) dans ApartmentsSeenBySearchers du user actif
            //Test: marche si vide (le user n'a rien vu pour l'instant)
            var user = $kinvey.getActiveUser();
            var query = new $kinvey.Query();
            query.equalTo('user._id', user._id);
            return $kinvey.DataStore.find('ApartmentsSeenBySearchers', query).then(function(response) {
                if(response.length === 0) {
                    return null;
                } else {
                    return response[0];
                }
            });
        };

        var updateApartmentsSeenBySearchers = function(apart, searcherEntity) {
            //Test: marche
            //utilise le résultat de getApartmentsSeenBySearchersEntity
            //Rajoute l'appartement vu par le searcher dans son tableau d'appartements dans ApartmentsSeenBySearchers
            var user = $kinvey.getActiveUser();
            if(!searcherEntity) {
                searcherEntity = {
                    user: user,
                    apartments: [apart]
                };
            } else {
                searcherEntity.aparts = _.uniq(_.union(searcherEntity.aparts, [apart]), '_id');
            }
            $kinvey.DataStore.save('ApartmentsSeenBySearchers', searcherEntity, {
                exclude: ['user', 'apartments'],
                relations: {
                    user: 'user',
                    apartments: 'Apartments'
                }
            });
        };

        // var getApartmentsAppliedEntityForSearchers = function(apart) {
        //     //Test:marchait la 1ere fois
        //     //renvoi l'entité dans ApartmentsApplied de l'appart passé en paramètre qui correspond à l'apart que cherche le user actif
        //     var user = $kinvey.getActiveUser();
        //     var query = new $kinvey.Query();
        //     query.equalTo('apartment._id', apart._id);
        //     query.equalTo('user._id', user._id);
        //     return $kinvey.DataStore.find('apartmentsApplied', query).then(function(response) {
        //         if(response.length === 0) {
        //             return null;
        //         } else {
        //             return response[0];
        //         }
        //     });
        // };

        var updateApartmentsApplied = function(apart) {
            //TEST: Marche quand c'est le premier qui apply, ça créé bien l'entité dans la bonne collection
            //A appeller quand le searcher click sur "Introduce me"
            //Rajoute une entité dans ApartmentsApplied (user= celui qui postule, apartement= apart auquel on postule)
            var user = $kinvey.getActiveUser();
            var apartmentsAppliedEntity = {
                apartment: apart,
                user: user,
                channel: '',
                seenBy: []
            };
            var query = new $kinvey.Query();
            query.equalTo('apartment._id', apart._id);
            return $kinvey.User.find(query).then(function(response) {
                var acl = new $kinvey.Acl(apartmentsAppliedEntity);
                acl.addWriter(response[0]._id);
                return $kinvey.DataStore.save('apartmentsApplied', apartmentsAppliedEntity, {
                    exclude: ['apartment', 'user', 'seenBy'],
                    relations: {
                        apartment: 'Apartments',
                        user: 'user',
                        seenBy: 'user'
                    }
                });
            });

        };

        var getApplicantEntity = function() {
            //TEST: marche
            //renvoi l'entité dans Applicants du user actif
            var user = $kinvey.getActiveUser();
            var query = new $kinvey.Query();
            query.equalTo('user._id', user._id);
            return $kinvey.DataStore.find('Applicants', query).then(function(response) {
                if(response.length === 0) {
                    return null;
                } else {
                    return response[0];
                }
            });
        };

        var updateApplicants = function(apart, applicantEntity) {
            //TEST : marche quand c'est la premiere fois qu'on crée l'entité
            //Utilise le résultat de getApplicantEntity
            //A appeller quand le searcher click sur "Introduce me"
            //Rajoute l'appartement auquel le searcher postule  dans le tableau apartments dans Applicants
            var user = $kinvey.getActiveUser();
            if(!applicantEntity) {
                applicantEntity = {
                    user: user,
                    apartments: [{
                        apartmentId: apart._id,
                        channel: ''
                    }]
                };
            } else {
                applicantEntity.apartments = _.uniq(_.union(applicantEntity.apartments, [{
                    apartmentId: apart._id,
                    channel: ''
                }]));
            }
            var query = new $kinvey.Query();
            query.equalTo('apartment._id', apart._id);
            return $kinvey.User.find(query).then(function(response) {
                var acl = new $kinvey.Acl(applicantEntity);
                acl.addWriter(response[0]._id);
                $kinvey.DataStore.save('Applicants', applicantEntity, {
                    exclude: ['user'],
                    relations: {
                        user: 'user'
                    }
                });
            });
        };

        var getApplicantsFromApartmentsApplied = function() {
            //TEST marche
            //Renvoie un tableau d'entités d'ApartmentsApplied avec le même appartement (celui de l'offreur) et différents users (les applicants)
            var user = $kinvey.getActiveUser();
            var query = new $kinvey.Query();
            query.equalTo('apartment._id', user.apartment._id);
            return $kinvey.DataStore.find('apartmentsApplied', query).then(function(response) {
                if(response.length === 0) {
                    return null;
                } else {
                    return response;
                }
            });
        };

        var getUsersFromId = function(arrayOfApplicants) {
            //TEST: marche
            var query = new $kinvey.Query();
            query.contains('_id', arrayOfApplicants);
            return $kinvey.User.find(query);
        };

        var getVideoFromApplicantsToBeDisplayed = function() {
            //TEST: marche
            //Fonction executée soit dans le splash screen soit lorsque le user change de mode
            //Renvoie un tableau de JSON de users dont l'offreur doit visionner les vidéos
            //A tester
            var user = $kinvey.getActiveUser();
            return getApplicantsFromApartmentsApplied().then(function(response) {
                var arrayApplicantsToBeDisplayed = [];
                for(var i = 0; i < response.length; i++) {
                    var toBeDisplayed = true;
                    for(var j = 0; j < response[i].seenBy.length; j++) {
                        if(response[i].seenBy[j] === user._id) {
                            toBeDisplayed = false;
                            break;
                        }
                    }
                    if(toBeDisplayed) {
                        arrayApplicantsToBeDisplayed.push(response[i].user._id);
                    }
                }
                return arrayApplicantsToBeDisplayed;
            });
        };

        var updateApartmentsAppliedSeenBy = function(apartmentsAppliedEntity, applicantId) {
            //TEST marche
            //On appelle la fonction getApartmentsAppliedEntityForOffers avant, et on utilise celle la dans le .then
            //Dans ApartmentsApplied, update le tableau applicants en mettant seenby le user qui offre
            var user = $kinvey.getActiveUser();
            // var index = _.findIndex(apartmentsAppliedEntity.applicants, function(chr) {
            //     return chr.userId === applicantId;
            // });
            apartmentsAppliedEntity.seenBy = _.uniq(_.union(apartmentsAppliedEntity.seenBy, [user]));
            $kinvey.DataStore.save('apartmentsApplied', apartmentsAppliedEntity, {
                exclude: ['apartment', 'user', 'seenBy'],
                relations: {
                    apartment: 'Apartments',
                    user: 'user',
                    seenBy: 'user'
                }
            });
        };

        var getApartmentsAppliedEntityForOffers = function(applicant) {
            //TEST: marche quand il ya un seul postulant par appart (une seule entité dans apart applied)
            //Renvoie toute l'entité (un json) (depuis ApartmentsApplied) pour l'appartement de l'offreur avec le user étant l'applicant
            var user = $kinvey.getActiveUser();
            var query = new $kinvey.Query();
            query.equalTo('apartment._id', user.apartment._id);
            query.equalTo('user._id', applicant._id);
            return $kinvey.DataStore.find('apartmentsApplied', query).then(function(response) {
                return response[0];
            });
        };

        var updateChannel = function(applicant, newChannelPotentiel) {
            //TEST : marche 1ere passe
            //On commence par aller chercher le tableau des applicants dans ApartmentsApplied pour l'appart de l'offreur
            //On chope l'index correspondant au postulant que l'on a liké et on update son channel.
            var me = $kinvey.getActiveUser();
            getApartmentsAppliedEntityForOffers(applicant).then(function(response) {
                // var index = _.findIndex(response.applicants, function(chr) {
                //     return chr.userId === applicantId;
                // });
                if(response.channel === '') {
                    response.channel = newChannelPotentiel;
                    return $kinvey.DataStore.save('apartmentsApplied', response, {
                        exclude: ['apartment', 'user', 'seenBy'],
                        relations: {
                            apartment: 'Apartments',
                            user: 'user',
                            seenBy: 'user'
                        }
                    }).then(function(response2) {
                        //On va maintenant update les channel dans applicants
                        var query = new $kinvey.Query();
                        query.equalTo('user._id', applicant._id);
                        $kinvey.DataStore.find('Applicants', query).then(function(response3) {
                            var indexApartment = _.findIndex(response3[0].apartments, function(chr) {
                                return chr.apartmentId === me.apartment._id;
                            });
                            response3[0].apartments[indexApartment].channel = newChannelPotentiel;
                            $kinvey.DataStore.save('Applicants', response3[0], {
                                exclude: ['user'],
                                relations: {
                                    user: 'user'
                                }
                            });
                        });
                    });
                } else {
                    //Aller dans le chat existant
                }

            });
        };

        //FAire une fonction rejoindre une colloc qui donne les droits de write sur apartmentsApplied

        var saveEvent = function(ev) {
            $kinvey.DataStore.save('events', ev, {
                relations: {
                    location: 'locations',
                    'location.country': 'countries'
                }
            });
        };

        return {
            createApartment: createApartment,
            // associateApartmentToUser: associateApartmentToUser,
            deleteApartment: deleteApartment,
            getApartmentsToDisplay: getApartmentsToDisplay,
            getChatConversionsForSearchers: getChatConversionsForSearchers,
            getArrayOfApartmentsInCircleForSearchers: getArrayOfApartmentsInCircleForSearchers,
            getApartmentsSeenBySearchersEntity: getApartmentsSeenBySearchersEntity,
            updateApartmentsSeenBySearchers: updateApartmentsSeenBySearchers,
            // getApartmentsAppliedEntityForSearchers: getApartmentsAppliedEntityForSearchers,
            updateApartmentsApplied: updateApartmentsApplied,
            getApplicantEntity: getApplicantEntity,
            updateApplicants: updateApplicants,
            getApplicantsFromApartmentsApplied: getApplicantsFromApartmentsApplied,
            getUsersFromId: getUsersFromId,
            getVideoFromApplicantsToBeDisplayed: getVideoFromApplicantsToBeDisplayed,
            updateApartmentsAppliedSeenBy: updateApartmentsAppliedSeenBy,
            getApartmentsAppliedEntityForOffers: getApartmentsAppliedEntityForOffers,
            updateChannel: updateChannel,
            saveEvent: saveEvent
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
