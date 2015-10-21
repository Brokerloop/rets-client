/*jshint node:true */
/* jshint -W097 */
'use strict';

var config = require('../testconfig.json'),
    assert = require('chai').assert,
    rets = require('../../../index.js'),
    utils = require('../../../lib/utils.js'),
    xmlParser = require('xml2js').parseString;

var TEST_TIMEOUT = 10000;

describe('test client.getMetadata functionality', function() {
    it('Client invokes getMetadata to retrieve resources metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);
        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once("connection.success", function(){

            client.getMetadata("METADATA-RESOURCE", "0", "COMPACT", function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");

                xmlParser(data, function(err, result) {
                    utils.replyCodeCheck(result, function(error, data){
                        assert.ifError(error);
                    });
                });

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });
            });
        });

        client.once("metadata.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });

    });
});
describe('test client.getSystem functionality', function() {
    it('Client invokes getSystem to retrieve system metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);
        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once("connection.success", function(){

            client.getSystem(function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");

                assert(data.metadataVersion, "metadataVersion is present");
                assert(data.metadataDate, "metadataDate is present");
                assert(data.systemId, "systemId is present");
                assert(data.systemDescription, "systemDescription is present");

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });
            });
        });

        client.once("metadata.system.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.system.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});


describe('test client.getResources meta functionality', function() {
    it('Client retrieves resources metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);

        client.once("connection.success", function(){
            client.getResources(function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");
                assert(data.Version, "Version field is present");
                assert(data.Date, "Date field is present");
                assert(data.Resources, "Resources field is present");
                assert.typeOf(data.Resources, 'array', "data.Resources is an array");
                for(var dataItem = 0; dataItem < data.Resources.length; dataItem++) {
                    assert.isNotNull(data.Resources[dataItem]);
                    assert(data.Resources[dataItem].ResourceID, "data.Resources["+dataItem+"].ResourceID field is present");
                    assert(data.Resources[dataItem].StandardName, "data.Resources["+dataItem+"].StandardName field is present");
                    assert(data.Resources[dataItem].VisibleName, "data.Resources["+dataItem+"].VisibleName field is present");
                    assert(data.Resources[dataItem].ObjectVersion, "data.Resources["+dataItem+"].ObjectVersion field is present");
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.resources.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.resources.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getAllClass meta functionality', function() {
    it('Client retrieves a list of all class metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);
        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once("connection.success", function() {

            client.getAllClass(function(error, data) {
                assert.ifError(error);
                assert.isArray(data);
                for(var i = 0; i < data.length; i++) {
                    var cls = data[i];
                    assert.isNotNull(cls, "Data is present");
                    assert(cls.Classes, "data.Classes is present");
                    assert.typeOf(cls.Classes, 'array', "data.Classes is an array");
                    assert(cls.Version, "data.Version field is present");
                    assert(cls.Date, "data.Date field is present");
                    assert(cls.Resource, "data.Resource field is present");
                    for(var classItem = 0; classItem < cls.Classes.length; classItem++) {

                        assert.isNotNull(cls.Classes[classItem]);
                        assert(cls.Classes[classItem].ClassName, "cls.Classes["+classItem+"] ClassName field is present");
                        assert(cls.Classes[classItem].StandardName, "cls.Classes["+classItem+"] StandardName field is present");
                        assert(cls.Classes[classItem].VisibleName, "cls.Classes["+classItem+"] VisibleName field is present");
                        assert(cls.Classes[classItem].TableVersion, "cls.Classes["+classItem+"] TableVersion field is present");
                    }
                }


                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.all.class.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.all.class.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });

    });
});

describe('test client.getClass meta functionality', function() {
    it('Client retrieves an individual class metadata entry', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);
        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once("connection.success", function() {

            client.getClass(config.testResourceType, function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");

                assert(data.Classes, "data.Classes is present");
                assert.typeOf(data.Classes, 'array', "data.Classes is an array");

                assert(data.Version, "data.Version field is present");
                assert(data.Date, "data.Date field is present");
                assert(data.Resource, "data.Resource field is present");

                for(var classItem = 0; classItem < data.Classes.length; classItem++) {
                    assert.isNotNull(data.Classes[classItem]);
                    assert(data.Classes[classItem].ClassName, "data.Classes["+classItem+"] ClassName field is present");
                    assert(data.Classes[classItem].StandardName, "data.Classes["+classItem+"] StandardName field is present");
                    assert(data.Classes[classItem].VisibleName, "data.Classes["+classItem+"] VisibleName field is present");
                    assert(data.Classes[classItem].TableVersion, "data.Classes["+classItem+"] TableVersion field is present");
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.class.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.class.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });

    });
});

describe('test client.getAllTable meta functionality', function() {
    it('Client retrieves a list of all table metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function() {

            client.getAllTable(function(error, data) {
                assert.ifError(error);
                assert.isArray(data);
                for(var i = 0; i < data.length; i++) {
                    var tbl = data[i];
                    assert.isNotNull(tbl, "Data is present");
                    assert(tbl.Fields, "data.Fields is present");
                    assert.typeOf(tbl.Fields, 'array', "data.Fields is an array");

                    assert(tbl.Version, "data.Version field is present");
                    assert(tbl.Date, "data.Date field is present");
                    assert(tbl.Resource, "data.Resource field is present");
                    assert(tbl.Class, "data.Class field is present");

                    for(var fieldItem = 0; fieldItem < tbl.Fields.length; fieldItem++) {

                        assert.isNotNull(tbl.Fields[fieldItem]);
                        assert(tbl.Fields[fieldItem].MetadataEntryID, "tbl.Fields["+fieldItem+"] MetadataEntryID field is present");
                        assert(tbl.Fields[fieldItem].SystemName, "tbl.Fields["+fieldItem+"] SystemName field is present");
                        assert(tbl.Fields[fieldItem].ShortName, "tbl.Fields["+fieldItem+"] ShortName field is present");
                        assert(tbl.Fields[fieldItem].LongName, "tbl.Fields["+fieldItem+"] LongName field is present");
                        assert(tbl.Fields[fieldItem].DataType, "tbl.Fields["+fieldItem+"] DataType field is present");
                    }
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.all.table.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.all.table.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getTable meta functionality', function() {
    it('Client retrieves an individual table metadata entry', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function(){

            client.getTable(config.testResourceType, config.testClassType, function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");
                assert(data.Fields, "data.Fields is present");
                assert.typeOf(data.Fields, 'array', "data.Fields is an array");

                assert(data.Version, "data.Version field is present");
                assert(data.Date, "data.Date field is present");
                assert(data.Resource, "data.Resource field is present");
                assert(data.Class, "data.Class field is present");

                for(var tableItem = 0; tableItem < data.Fields.length; tableItem++) {
                    assert.isNotNull(data.Fields[tableItem]);
                    assert(data.Fields[tableItem].MetadataEntryID, "data.Fields["+tableItem+"] MetadataEntryID field is present");
                    assert(data.Fields[tableItem].SystemName, "data.Fields["+tableItem+"] SystemName field is present");
                    assert(data.Fields[tableItem].ShortName, "data.Fields["+tableItem+"] ShortName field is present");
                    assert(data.Fields[tableItem].LongName, "data.Fields["+tableItem+"] LongName field is present");
                    assert(data.Fields[tableItem].DataType, "data.Fields["+tableItem+"] DataType field is present");
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.table.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.table.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getAllLookups meta functionality', function() {
    it('Client retrieves a list of all lookups metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function(){

            client.getAllLookups(function(error, data) {
                assert.ifError(error);
                assert.isArray(data);

                for(var i = 0; i < data.length; i++) {
                    var lookup = data[i];
                    assert.isNotNull(lookup, "Data is present");

                    assert(lookup.Lookups, "data.Lookups is present");
                    assert.typeOf(lookup.Lookups, 'array', "data.Lookups is an array");

                    assert(lookup.Version, "data.Version field is present");
                    assert(lookup.Date, "data.Date field is present");
                    assert(lookup.Resource, "data.Resource field is present");


                    for(var lookupItem = 0; lookupItem < lookup.Lookups.length; lookupItem++) {

                        assert.isNotNull(lookup.Lookups[lookupItem]);
                        assert(lookup.Lookups[lookupItem].MetadataEntryID, "lookup.Lookups["+lookupItem+"] MetadataEntryID field is present");
                        assert(lookup.Lookups[lookupItem].LookupName, "lookup.Lookups["+lookupItem+"] LookupName field is present");
                        assert(lookup.Lookups[lookupItem].VisibleName, "lookup.Lookups["+lookupItem+"] VisibleName field is present");
                    }
                }


                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.all.lookups.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.all.lookups.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getLookups meta functionality', function() {
    it('Client retrieves an individual lookups metadata entry', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function(){

            client.getLookups(config.testResourceType, function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");
                assert(data.Lookups, "data.Lookups is present");
                assert.typeOf(data.Lookups, 'array', "data.Lookups is an array");

                assert(data.Version, "data.Version field is present");
                assert(data.Date, "data.Date field is present");
                assert(data.Resource, "data.Resource field is present");
                for(var lookupItem = 0; lookupItem < data.Lookups.length; lookupItem++) {

                    assert.isNotNull(data.Lookups[lookupItem]);
                    assert(data.Lookups[lookupItem].MetadataEntryID, "data.Lookups["+lookupItem+"] MetadataEntryID field is present");
                    assert(data.Lookups[lookupItem].LookupName, "data.Lookups["+lookupItem+"] LookupName field is present");
                    assert(data.Lookups[lookupItem].VisibleName, "data.Lookups["+lookupItem+"] VisibleName field is present");
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.lookups.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.lookups.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getAllLookupTypes meta functionality', function() {
    it('Client retrieves a list of all lookupTypes metadata', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function(){

            client.getAllLookupTypes(function(error, data) {
                assert.ifError(error);

                assert.isArray(data);

                for(var i = 0; i < data.length; i++) {
                    var lookupType = data[i];

                    assert.isNotNull(lookupType, "Data is present");
                    assert(lookupType.LookupTypes, "data.LookupTypes is present");
                    assert.typeOf(lookupType.LookupTypes, 'array', "data.LookupTypes is an array");

                    assert(lookupType.Version, "data.Version field is present");
                    assert(lookupType.Date, "data.Date field is present");
                    assert(lookupType.Resource, "data.Resource field is present");
                    assert(lookupType.Lookup, "data.Lookup field is present");

                    for(var lookupTypeItem = 0; lookupTypeItem < lookupType.LookupTypes.length; lookupTypeItem++) {

                        assert.isNotNull(lookupType.LookupTypes[lookupTypeItem]);

                        assert(lookupType.LookupTypes[lookupTypeItem].MetadataEntryID, "lookupType.LookupTypes["+lookupTypeItem+"] MetadataEntryID field is present");
                        assert(lookupType.LookupTypes[lookupTypeItem].LongValue, "lookupType.LookupTypes["+lookupTypeItem+"] LongValue field is present");
                        assert(lookupType.LookupTypes[lookupTypeItem].ShortValue, "lookupType.LookupTypes["+lookupTypeItem+"] ShortValue field is present");
                        assert(lookupType.LookupTypes[lookupTypeItem].Value, "lookupType.LookupTypes["+lookupTypeItem+"] Value field is present");
                    }
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.all.lookupTypes.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.all.lookupTypes.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getLookupTypes meta functionality', function() {
    it('Client retrieves an individual lookupTypes metadata entry', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function(){

            client.getLookupTypes(config.testResourceType, config.testLookupType, function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");
                assert(data.LookupTypes, "data.LookupTypes is present");
                assert.typeOf(data.LookupTypes, 'array', "data.LookupTypes is an array");

                assert(data.Version, "data.Version field is present");
                assert(data.Date, "data.Date field is present");
                assert(data.Resource, "data.Resource field is present");
                assert(data.Lookup, "data.Lookup field is present");

                for(var lookupItem = 0; lookupItem < data.LookupTypes.length; lookupItem++) {

                    assert.isNotNull(data.LookupTypes[lookupItem]);
                    assert(data.LookupTypes[lookupItem].MetadataEntryID, "data["+lookupItem+"] MetadataEntryID field is present");
                    assert(data.LookupTypes[lookupItem].LongValue, "data["+lookupItem+"] LongValue field is present");
                    assert(data.LookupTypes[lookupItem].ShortValue, "data["+lookupItem+"] ShortValue field is present");
                    assert(data.LookupTypes[lookupItem].Value, "data["+lookupItem+"] Value field is present");
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.lookupTypes.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.lookupTypes.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});

describe('test client.getObjectMeta meta functionality', function() {
    it('Client retrieves a resource object metadata entry', function(done) {
        var mochaTest = this;
        var client = rets.getClient(config.url, config.username, config.password);

        mochaTest.timeout(TEST_TIMEOUT);
        assert(client, "Client is present");

        client.once('connection.success', function(){

            client.getObjectMeta(config.testResourceType, function(error, data) {
                assert.ifError(error);
                assert.isNotNull(data, "Data is present");
                assert(data.Objects, "data.Objects is present");
                assert.typeOf(data.Objects, 'array', "data.Objects is an array");

                assert(data.Version, "data.Version field is present");
                assert(data.Date, "data.Date field is present");
                assert(data.Resource, "data.Resource field is present");

                for(var objectItem = 0; objectItem < data.Objects.length; objectItem++) {

                    assert.isNotNull(data.Objects[objectItem]);
                    assert(data.Objects[objectItem].ObjectType, "data.Objects["+objectItem+"] ObjectType field is present");
                    assert(data.Objects[objectItem].MIMEType, "data.Objects["+objectItem+"] MIMEType field is present");
                    assert(data.Objects[objectItem].MetaDataEntryID, "data.Objects["+objectItem+"] MetaDataEntryID field is present");
                    assert(data.Objects[objectItem].VisibleName, "data.Objects["+objectItem+"] VisibleName field is present");
                }

                client.logout(function(error){
                    assert.ifError(error);
                    done();
                });

            });
        });

        client.once("metadata.object.success", function(data) {
            assert(data, "data is present");
        });

        client.once("metadata.object.failure", function(error){
            assert.ifError(error, "Metadata call should not have failed");
        });

        client.once("connection.failure", function(error){
            assert.ifError(error, "getClient failure");
        });
    });
});
