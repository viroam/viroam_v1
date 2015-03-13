'use strict';
var servicename = 'files';

module.exports = function(app) {

    var _ = require('lodash');
    var angular = require('angular');

    var dependencies = [
        '$window', '$q', '$http', '$kinvey',
        app.name + '.rest'
    ];

    function service($window, $q, $http, $kinvey, rest) {

        var _endsWith = function(value, suffix) {
            return value.toLowerCase().indexOf(suffix.toLowerCase(), value.length - suffix.length) !== -1;
        };

        var _isFile = function(file) {
            return file.constructor && file.constructor.name === 'File' || file.toString() === '[object File]';
        };

        var _resolveFileFromLocalURL = function(url) {
            var deferred = $q.defer();
            if($window.resolveLocalFileSystemURL) {
                $window.resolveLocalFileSystemURL(url, function(entry) {
                    entry.file(function(s) {
                        deferred.resolve(s);
                    });
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.reject('window.resolveLocalFileSystemURL doesnt exist');
            }
            return deferred.promise;
        };

        var _readFile = function(file, type, encoding) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                deferred.resolve(evt.target.result);
            };
            reader.onerror = function(error) {
                deferred.reject(error);
            };
            if(type === 'text') {
                reader.readAsText(file, encoding);
            } else if(type === 'binary') {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsDataURL(file);
            }
            return deferred.promise;
        };

        var _uploadToKinvey = function(file, isPrivate, options) {
            var uri = rest.getProtocol() + '//baas.kinvey.com/blob/' + $kinvey.appKey;
            var headers = rest.getHeaders();
            headers['X-Kinvey-Content-Type'] = file.type;

            options = angular.extend(options || {}, {
                '_filename': file.name,
                'size': file.size,
                'mimeType': file.type,
                '_public': isPrivate !== true
            });

            return $kinvey.Persistence.Net.request('POST', uri, options, headers);
        };

        var _b64toBlob = function(base64Data, mimeType) {
            base64Data = base64Data.replace('data:' + mimeType + ';base64,', '').replace(/\s/g, '');
            //Check if the android workaround is sufficient for IOS as well and then send ArrayBuffer instead of blob every time
            var byteString = atob(base64Data);
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for(var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return ab;
        };

        var _getMimeType = function(fileEntry) {
            if(fileEntry.type) {
                return fileEntry.type;
            }
            if(_endsWith(fileEntry.name, 'jpg') || _endsWith(fileEntry.name, 'jpeg')) {
                return 'image/jpeg';
            }
            if(_endsWith(fileEntry.name, 'png')) {
                return 'image/png';
            }
            if(_endsWith(fileEntry.name, 'mov')) {
                return 'video/quicktime';
            }
            if(_endsWith(fileEntry.name, 'mp4')) {
                return 'video/mp4';
            }
            return '';
        };

        var getById = function(fileId) {
            var uri = rest.getProtocol() + '//baas.kinvey.com/blob/' + $kinvey.appKey + '/' + fileId;
            var headers = rest.getHeaders();
            return $kinvey.Persistence.Net.request('GET', uri, null, headers);
        };

        var _uploadFile = function(data, file, isPrivate, options) {
            return _uploadToKinvey(file, isPrivate, options).then(function(response) {
                var uri = response._uploadURL.replace('http:', rest.getProtocol());
                var headers = response._requiredHeaders;
                headers['Content-Type'] = file.type;

                // Delete fields from the response.
                delete response._expiresAt;
                delete response._requiredHeaders;
                delete response._uploadURL;

                return $http({
                    data: data,
                    headers: headers,
                    method: 'PUT',
                    transformRequest: angular.identity,
                    url: uri
                }).then(function(status) {
                    return getById(response._id);
                });
            });
        };

        var upload = function(object, isPrivate, options) {
            var mimeType;
            var blob;
            var file;
            try {
                if(_isFile(object)) {
                    return _uploadFile(object, isPrivate, options);
                } else if(object.indexOf('data:') === 0) {
                    mimeType = object.split(',')[0].split(':')[1].split(';')[0];
                    blob = _b64toBlob(object, mimeType);
                    return _uploadFile(blob, isPrivate, options);
                } else {
                    mimeType = '';
                    return _resolveFileFromLocalURL(object).then(function(fileEntry) {
                        mimeType = _getMimeType(fileEntry);
                        file = {
                            name: fileEntry.name,
                            size: fileEntry.size,
                            type: mimeType
                        };
                        return _readFile(fileEntry);
                    }).then(function(data) {
                        blob = _b64toBlob(data, mimeType);
                        return _uploadFile(blob, file, isPrivate, options);
                    });
                }
            } catch(err) {
                var deferred = $q.defer();
                deferred.reject(err);
                return deferred.promise;
            }
        };

        var getAll = function(mime) {
            var query = new $kinvey.Query();
            if(!mime) {
                query.contains('mimeType', ['image/jpeg', 'image/png']);
            } else {
                query.contains('mimeType', angular.isArray(mime) ? mime : [mime]);
            }
            query.descending('_kmd.lmt');

            return $kinvey.File.find(query);
        };

        var getStorageSize = function() {
            var query = new $kinvey.Query();
            return $kinvey.File.find(query).then(function(files) {
                return _.reduce(files, function(size, f) {
                    return size + _.isNumber(f.size) ? f._size : 0;
                });
            });
        };

        return {
            upload: upload,
            getAll: getAll,
            read: _readFile,
            getStorageSize: getStorageSize
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
