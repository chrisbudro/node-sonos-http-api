


// var metadataTemplate = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"> ' +
//     ' <item id="000c206cartist_radio.1524" parentID="00020000artists:dr dog" restricted="true"><dc:title>Dr. Dog</dc:title><upnp:class>object.item.audioItem.audioBroadcast</upnp:class> ' +
//     '<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON1543_X_#Svc1543-0-Token</desc></item></DIDL-Lite>'

var metadataTemplate = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"> ' +
    ' <item id="{metadataID}" parentID="{parentURI}" restricted="true"><dc:title>{title}</dc:title><upnp:class>object.item.audioItem.{classType}</upnp:class> ' +
    '<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON1543_X_#Svc1543-0-Token</desc></item></DIDL-Lite>'


// var uriTemplates = {
//     song: 'x-sonos-http:{id}.mp4?sid=204&flags=8224&sn=4',
//     album: 'x-rincon-cpcontainer:0004206c{id}',
//     name: 'x-sonos-http:{id}.mp4?sid=204&flags=8224&sn=4',
//     radio: 'x-sonosapi-radio:{id}?sid=204&flags=8300&sn=13'
//
// };


// var uriTemplate = 'x-sonosapi-radio:artist_radio.{id}?sid=6&flags=8300&sn=6';
var uriTemplate = 'x-sonosapi-radio:{id}?sid=6&flags=8300&sn=6';

var metadataURIStarter = '000c206c';

var METADATA_URI_STARTERS = {
    // song: '00032020',
    // album: '0004206c',
    // name: '00032020',
    radio: '000c206c'
};

var RADIO_ID_STARTERS = {
    artist: 'artist_radio'
};

var PARENTS = {
    // song: '0004206calbum%3a',
    // album: '00020000album%3a',
    // name: '0004206calbum%3a',
    // radio: '00020000radio:'
    artist: '00020000artists:'
};

var CLASSES = {
    artist: 'audioBroadcast'
}

function iHeartRadio(player, values) {
    var action = values[0];
    var stationID = values[1];

    var type = 'artist'; //Temporary hardcode to prepare for future types
    var idStarter = RADIO_ID_STARTERS[type];
    stationID = idStarter + "." + stationID;

    var metadataID = metadataURIStarter + encodeURIComponent(stationID);

    var uri = uriTemplate.format({id: encodeURIComponent(stationID)});

    var metadata = metadataTemplate.format({
        metadataID: metadataID,
        parentURI: PARENTS[type],
        classType: CLASSES[type],
        title: ''
    });

    if(action == 'now') {

        var nextTrackNo = player.coordinator.state.trackNo + 1;
        player.coordinator.addURIToQueue(uri, metadata, true, nextTrackNo, function (error, res) {
            if (!error) {
                player.coordinator.nextTrack(function (error) {
                    if (!error) {
                        player.coordinator.play();
                    }
                });
            }
        });
    }
}

module.exports = function(api) {
    api.registerAction('iheartradio', iHeartRadio);
}