var currentPlayer = 'currentVideo';
var listType = 'playlist';
var list = 'PLmZXWNsbh65gVLF9bFgOGp_89hyx19gpb';
var playerList = {
    first: 0,
    last: 99,
    current: 0,
    next: 0,
    previous: 0 
};
var startIndex = 0;
var startTime = 0;
var player, gallery;
var playerWidth = 620;
var playerHeight = 360;
var playerOptions = {
    autoplay: 0,        // 0 - (default) Do not automatically play video when the player loads, 1 - Automatically start playing video when the player loads.
    cc_load_policy: 0,	// UserDefined - (default) The default behavior is based on the user's preference, 1 - Cause closed captions to be shown by default even if the user has turned captions off.
    color: 'red',       // Red - (default) Red, White - White progress bar filling
    controls: 1,        // 1 - (default) Display player controls in the video player, 0 - Do not display player controls in the video player.
    disablekb: 0,       // 0 - (default) Enable player keyboard controls, 1 - Disable player keyboard controls
                        /*
                            Spacebar: Play / Pause,
                            Left arrow: Jump back a few seconds in current video.
                            Right arrow: Jump ahead a few seconds in current video.
                            Up arrow: Volume up
                            Down arrow: Volume down
                        */
    enablejsapi: 1,     // 0 - (default) Do not enable the API, 1 - Enable the player to be controlled using the IFrame Player API.
    end: '', 	        // The time offset at which the video should stop playing.The value is a positive integer that specifies the number of seconds into the video that the player stops playback.
    fs: 1,              // 1 - (default) The player displays a button to view a fullscreen player, 0 - The player does not display the button.
    hl: '',             // Sets the player's interface language. The parameter value is an ISO 639-1 two-letter language code or a fully specified locale, such as "fr" or "fr-ca".
                        // Other language input codes, such as IETF language tags(BCP 47) might also be handled properly.
                        // The interface language is used for tooltips in the player and also affects the default caption track.
    iv_load_policy: 1,  // 1 - (default) Show video annotations, 3 - Do not show video annotations.
    list: list,         // In conjunction with the "list" parameter, this parameter identifies the content that loads in the player.
    listType: listType,
                        /*
                            playlist - The "list" parameter specifies a YouTube playlist ID. Make sure the parameter value begins with the letters "PL".
                            user_uploads - The "list" parameter specifies the YouTube channel whose uploaded videos are loaded.
                        */
    loop: 0,            // 0 - (default) Do not continuously play video or entire playlist, 1 - If the player is loading a single video, play the video again and again.
                        // If the player is loading a playlist, play the entire playlist and then start again at the first video.
    modestbranding: 0,  // 0 - A YouTube logo displays in the player control bar, 1 - Prevent the YouTube logo from displaying in the control bar.
                        // A YouTube text label or watermark still displays when the user's mouse pointer hovers over the player.
    origin: '',         // This parameter provides an extra security measure for the IFrame API and is only supported for IFrame embeds.
                        // If you are using the IFrame API, which means you are setting the enablejsapi parameter value to 1, you should always specify your domain as the origin parameter value.
    playlist: '',       // A comma- separated list of video IDs that play in succession.
    playsinline: 0,     // 0 - (default) Cause fullscreen playback. Note that the default value is subject to change.
                        // 1 - Cause inline playback for "UIWebViews" created with the "allowsInlineMediaPlayback" property set to "TRUE".
    rel: 0,             // If the rel parameter is set to 0, related videos will come from the same channel as the video that was just played.
    start: '',          // The time offset at which the video should begin playing. The value is a positive integer that specifies the number of seconds into the video that the player should begin.
                        // The player looks for the closest keyframe at or before the time that you specify.
    widget_referrer: '',// This parameter identifies the URL where the player is embedded. This value is used in YouTube Analytics reporting when the YouTube player is embedded in a widget,
                        // and that widget is then embedded in a web page or application. In that scenario, the origin parameter identifies the widget provider's domain,
                        // but YouTube Analytics should not identify the widget provider as the actual traffic source. Instead, YouTube Analytics uses the widget_referrer
                        // parameter value to identify the domain associated with the traffic source.
};
// Resize Player Boundaries
function resizePlayer() {
    var frame = $("#currentVideoWrapper").find("iframe");
    frame.width($("#currentVideoWrapper").width());
    frame.height($("#currentVideoWrapper").height());
    if (player && player.setSize) {
        player.setSize(frame.width(), frame.height());
    }
}
// We listen to the resize event
window.addEventListener('resize', () => { resizePlayer(); });
// We listen to the orientationchange event
window.addEventListener('orientationchange', () => { resizePlayer(); });
// On Document Scroll
$(document).on("scroll", function () {
    if (player && player.getPlayerState) {
        // Visible
        if (isInView($("#currentVideoWrapper")[0])) {
            // play if not playing
            if (player.getPlayerState != 1)
                play();
        } else {
            // pause if not paused
            if (player.getPlayerState != 2)
                pause();
        }
    }
});
// Create a player
function createPlayer() {
    // Get the player base URL, which includes the API version and the selected video content.
    var options = {
        'enablejsapi': '1',
        'version': '3',
        'listType': listType,
        'list': list,
        'origin': window.location.origin, // 'origin': 'https://developers.google.com',
        'controls': 1,
        'modestbranding': 0,
        'showinfo': 0,
        'rel': 0,
        'autoplay': 0,
        'loop': 0,
        'playerapiid': currentPlayer
    };
    // Remove old player and create a new one.
    $("#currentVideoWrapper").empty();
    $("#currentVideoWrapper").append('<div id="' + currentPlayer + '"></div>');
    var w = $("#currentVideoWrapper").width() ? $("#currentVideoWrapper").width() : playerWidth;
    var h = $("#currentVideoWrapper").height() ? $("#currentVideoWrapper").height() : playerHeight;
    // console.log("w[" + w + "] h[" + h + "] window.YT[" + window.YT + "]");
    // Create Player
    if (window.YT) {
        window.YT.ready(function () {
            player = new YT.Player(currentPlayer, {
                height: w,
                width: h,
                playerVars: options,
                events: {
                    'onReady': onPlayerReady,
                    'onError': onPlayerError,
                    'onStateChange': onPlayerStateChange,
                    'onPlaybackRateChange': onPlayerPlaybackRateChange,
                    'onPlaybackQualityChange': onPlayerPlaybackQualityChange
                }
            })
            resizePlayer();
        });
    }
}
// Load Playlist
function onYouTubePlayerAPIReady() { createPlayer(); }
function initOWL() {
    // Gallery
    gallery = $(".gallery-slider");
    gallery.owlCarousel({
        items: 4,
        margin: 5,
        dots: false,
        autoWidth: true,
        lazyLoad: true,
        loop: true
    });
    // Touch Click Event
    gallery.find('.owl-item').each(function () {
        // Get Index
        var ndx = $(this).attr("data-index");
        // Click Event
        setClickEvent(this, function () {
            // Show Current Item
            $('.owl-item').removeClass('current');
            $('.owl-item[data-index=' + ndx + ']').addClass('current');
            // Play Item At
            if (player && player.stopVideo && player.playVideoAt) {
                player.stopVideo();
                player.playVideoAt(ndx);
            }
        });
    });
    // Go to the next item
    $('.gallery-NextBtn').click(function () {
        // If Player Exist Move With Player
        if (player && player.stopVideo && player.getPlaylist && player.getPlaylistIndex && player.playVideoAt && player.nextVideo) {
            // Stop Current
            player.stopVideo();
            // Is last video?
            playerList.current = parseInt($(".owl-item.current").attr("list-index"));
            playerList.next = (playerList.current + 1) > playerList.last ? playerList.first : (playerList.current + 1);
            var toplay = parseInt($(".owl-item[list-index='" + playerList.next + "']").attr("data-index"));
            // Next Video
            player.playVideoAt(toplay);
        } else {
            gallery.trigger('next.owl.carousel');
        }
    });
    // Go to the previous item
    $('.gallery-PrevBtn').click(function () {
        // If Player Exist Move With Player
        if (player && player.stopVideo && player.getPlaylist && player.getPlaylistIndex && player.playVideoAt && player.previousVideo) {
            // Stop Current
            player.stopVideo();
            // Is first video?
            playerList.current = parseInt($(".owl-item.current").attr("list-index"));
            playerList.previous = (playerList.current - 1) < playerList.first ? playerList.last : (playerList.current - 1);
            var toplay = parseInt($(".owl-item[list-index='" + playerList.previous + "']").attr("data-index"));
            // Previous Video
            player.playVideoAt(toplay);
        } else {
            gallery.trigger('prev.owl.carousel');
        }
    });
    // Auto Set First Player
    if (player && player.stopVideo && player.playVideoAt) {
        var toplay = parseInt($(".owl-item.current").attr("data-index"));
        player.playVideoAt(toplay);
        player.stopVideo();
    }
}
// Events
function onPlayerReady(event) {
    if (event && event.target) {
        player = event.target;
        // Playlist
        var playlist = player.getPlaylist();
        if (playlist) {
            playlistCount = playlist.length;
            playlistIndex = 0;
            $("#playlistvideos").empty();
            var htmlStr = "";
            var listCounter = 0;
            for (var i = 0; i < playlistCount; i++) {
                if (listCounter < 100) {
                    // Mark First Element as Active
                    playerList.last = listCounter;
                    if (listCounter == 0) {
                        htmlStr += '<div class="owl-item current" data-index="' + i + '" list-index="' + listCounter + '">';
                    } else {
                        htmlStr += '<div class="owl-item" data-index="' + i + '" list-index="' + listCounter + '">';
                    }
                    htmlStr += '<div class="gallery-item"><img src="https://img.youtube.com/vi/' + playlist[i] + '/sddefault.jpg" /></div>';
                    htmlStr += '</div>';
                }
                listCounter += 1;
            }
            $("#playlistvideos").append(htmlStr);
            // Init Owl Carousel
            initOWL();
        }
    }
}
function onPlayerError(errorCode) {
    if (typeof errorCode == 'object' && errorCode['data']) {
        errorCode = errorCode['data'];
    }
    // console.log('Error: ' + errorCode);
}
function onPlayerStateChange(newState) {
    if (typeof newState == 'object' && newState['data']) {
        newState = newState['data'];
    }
    var str = "";
    switch (parseInt(newState)) {
        case 5: str = 'video cued'; break;
        case 3: str = 'buffering'; break;
        case 2: str = 'paused'; break;
        case 1: str = 'playing'; break;
        case 0: str = 'ended'; break;
        case -1: str = 'unstarted'; break;
        default: str = 'Status uncertain'; break;
    }
    // Move Gallery To Position
    if (player && newState in [3, 2, 1]) {
        /*//
        owl.on('changed.owl.carousel', function (event) {
            // Provided by the core
            var element   = event.target;         // DOM element, in this example .owl-carousel
            var name      = event.type;           // Name of the event, in this example dragged
            var namespace = event.namespace;      // Namespace of the event, in this example owl.carousel
            var items     = event.item.count;     // Number of items
            var item      = event.item.index;     // Position of the current item
            // Provided by the navigation plugin
            var pages     = event.page.count;     // Number of pages
            var page      = event.page.index;     // Position of the current page
            var size      = event.page.size;      // Number of items per page
        });
        //*/
        // Get New Index
        var dataIndex = player.getPlaylistIndex();
        playerList.current = $('.owl-item[data-index=' + dataIndex + ']').attr("list-index");
        if (playerList.current < playerList.first) { playerList.current = playerList.first; }
        if (playerList.current >= playerList.last) { playerList.current = playerList.last; }
        // Show Current Item
        $('.owl-item').removeClass('current');
        $('.owl-item[data-index=' + dataIndex + ']').addClass('current');
        // Player
        gallery.trigger('to.owl.carousel', playerList.current);
    }
    // console.log('onPlayerStateChange event: Player state changed to: "' + newState + '" (' + str + ')');
}
function onPlayerPlaybackQualityChange(newQuality) {
    if (typeof newQuality == 'object' && newQuality['data']) {
        newQuality = newQuality['data'];
    }
    // console.log('onyPlayerPlaybackQualityChange event: Playback quality changed to "' + newQuality + '"');
}
function onPlayerPlaybackRateChange(newRate) {
    if (typeof newRate == 'object' && newRate['data']) {
        newRate = newRate['data'];
    }
    // console.log('onPlayerPlaybackRateChange event: Playback rate changed to "' + newRate + '"');
}
// ------------------------------------------------------------------------
// Playback controls and player settings
// ------------------------------------------------------------------------
/**
 * The 'play' function plays the currently cued/loaded video. It calls
 * player.playVideo().
 */
function play() {
    if (player && player.playVideo) {
        // console.log('playVideo();');
        player.playVideo();
    }
}
/**
 * The 'pause' function pauses the currently cued/loaded video. It calls
 * player.pauseVideo().
 */
function pause() {
    if (player && player.pauseVideo) {
        // console.log('pauseVideo();');
        player.pauseVideo();
    }
}
/**
 * The 'stop' function stops the currently cued/loaded video. It also
 * closes the NetStream object and cancels loading of the video. It calls
 * player.stopVideo().
 */
function stop() {
    if (player && player.stopVideo) {
        // console.log('stopVideo();');
        player.stopVideo();
    }
}
/**
 * The 'seekTo' function seeks to the specified time of the video. The
 * time is specified as an offest, measured in seconds from the beginning
 * of the video. The function causes the player to find the closest
 * keyframe before the specified value.
 * @param {number} seconds Mandatory The time offset to skip to.
 * @param {boolean} allowSeekAhead Mandatory A flag that indicates if
 *     the player will make a new request to the server if the
 *     specified time is beyond the currently loaded video data.
 */
function seekTo(seconds, allowSeekAhead) {
    if (player && player.seekTo) {
        // console.log('seekTo(' + seconds + ', ' + allowSeekAhead + ');');
        player.seekTo(seconds, allowSeekAhead);
    }
}
// ------------------------------------------------------------------------
// Playing a video in a playlist
// ------------------------------------------------------------------------
/**
 * The 'nextVideo' function plays the next video in a playlist.
 * It calls player.nextVideo().
 */
function nextVideo() {
    if (player && player.nextVideo) {
        // console.log('nextVideo();');
        player.nextVideo();
    }
}
/**
 * The 'previousVideo' function plays the previous video in a playlist.
 * It calls player.previousVideo().
 */
function previousVideo() {
    if (player && player.previousVideo) {
        // console.log('previousVideo();');
        player.previousVideo();
    }
}
/**
 * The 'playVideoAt' function seeks to a video at the specified playlist index.
 * @param {number} index Mandatory The playlist index of the video.
 */
function playVideoAt(index) {
    if (player && player.playVideoAt) {
        // console.log('playVideoAt(' + index + ');');
        player.playVideoAt(index);
    }
}
// ------------------------------------------------------------------------
// Setting playback behavior for playlists
// ------------------------------------------------------------------------
/**
 * The 'setLoop' function indicates whether videos should play in a loop.
 */
function setLoop(loop) {
    if (player && player.setLoop) {
        // console.log('setLoop(' + loop + ');');
        player.setLoop(loop);
    }
}
/**
 * The 'setShuffle' function indicates whether videos should be shuffled.
 * If videos are already shuffled and parameter is true, videos will be
 * reshuffled. If parameter is false, videos return to original order.
 * @param {boolean} shuffleVideos Mandatory Set to true to shuffle videos.
 */
function setShuffle(shuffle) {
    if (player && player.setShuffle) {
        // console.log('setShuffle(' + shuffle + ');');
        player.setShuffle(shuffle);
    }
}
/**
 * The 'getPlaylistIndex' function returns the playlist index position
 * of the currently playing video based on the current playlist order.
 * It calls player.getPlaylistIndex().
 * @return {number} The playlist index of the currently playing video.
 */
function getPlaylistIndex() {
    if (player && player.getPlaylistIndex) {
        var index = player.getPlaylistIndex();
        if (!index && index != 0) {
            return '';
        }
        return index;
    }
    return 0;
}
/**
 * The 'getPlaylistCount' function returns the number of videos in a
 * playlist by calling player.getPlaylist() and returning the length
 * of the array returned by that function.
 * @return {number} The number of videos in the playlist.
 */
function getPlaylistCount() {
    if (player && player.getPlaylist) {
        var playlist = player.getPlaylist();
        if (playlist) {
            return playlist.length;
        }
        return 0;
    }
    return 0;
}
// Changing the player volume
/**
 * The 'mute' function mutes the player. It calls player.mute().
 */
function mute() {
    if (player && player.mute) {
        // console.log('mute();');
        player.mute();
    }
}
/**
 * The 'unMute' function unmutes the player. It calls player.unMute().
 */
function unMute() {
    if (player && player.unMute) {
        // console.log('unMute();');
        player.unMute();
    }
}
/**
 * The 'isMuted' function determines whether the player is muted.
 * @return {string} Returns 'on' if volume is on and 'off' if volume is muted.
 */
function isMuted() {
    if (player && player.isMuted) {
        if (!player.isMuted()) {
            return 'on';
        }
        return 'off';
    }
    return 'off';
}
/**
 * The 'getVolume' function returns the player volume. The volume is
 * returned as an integer on a scale of 0 to 100. This function will
 * not necessarily return 0 if the player is muted. Instead, it will
 * return the volume level that the player would be at if unmuted.
 * It calls player.getVolume().
 * @return {number} A number between 0 and 100 that specifies current volume.
 */
function getVolume() {
    if (player && player.getVolume) {
        return player.getVolume();
    }
    return false;
}
/**
 * The 'setVolume' function sets the player volume.
 * @param {number} newVolume Mandatory The new player volume. The value
 *     must be an integer between 0 and 100. It calls player.setVolume(volume).
 */
function setVolume(newVolume) {
    if (player && player.setVolume) {
        // console.log('setVolume(' + newVolume + ');');
        player.setVolume(newVolume);
    }
}
/**
 * The 'setPlaybackRate' function sets the playback rate for the video.
 * It calls player.setPlaybackRate(playbackRate:String).
 * @param {string} playbackRate Mandatory The desired playback rate.
 */
function setPlaybackRate(playbackRate) {
    if (player && player.setPlaybackRate) {
        // console.log('setPlaybackRate(' + playbackRate + ');');
        player.setPlaybackRate(playbackRate);
    }
}
// ------------------------------------------------------------------------
// Playback status
// ------------------------------------------------------------------------
/**
 * The 'getBytesLoaded' function returns the number of bytes loaded for
 * the current video. It calls player.getVideoBytesLoaded().
 * @return {number} The number of bytes loaded for the current video.
 */
function getBytesLoaded() {
    if (player && player.getVideoBytesLoaded) {
        return player.getVideoBytesLoaded();
    }
    return false;
}
/**
 * The 'getBytesTotal' function returns the size in bytes of the currently
 * loaded/cued video. It calls player.getVideoBytesTotal().
 * @return {number} The total number of bytes in the video.
 */
function getBytesTotal() {
    if (player && player.getVideoBytesTotal) {
        return player.getVideoBytesTotal();
    }
    return false;
}
/**
 * The 'getVideoLoadedFraction' function returns the size in bytes of the currently
 * loaded/cued video. It calls player.getVideoLoadedFraction().
 * @return {number} The total number of bytes in the video.
 */
function getVideoLoadedFraction() {
    if (player && player.getVideoLoadedFraction) {
        return player.getVideoLoadedFraction();
    }
    return false;
}
/**
 * The 'getStartBytes' function returns the number of bytes from which the
 * currently loaded video started loading. It calls player.getVideoStartBytes().
 * @return {number} The number of bytes into the video when the player
 *     began playing the video.
 */
function getStartBytes() {
    if (player && player.getVideoStartBytes) {
        return player.getVideoStartBytes();
    }
    return false;
}
/**
 * The 'getCurrentTime' function returns the elapsed time in seconds from
 * the beginning of the video. It calls player.getCurrentTime().
 * @return {number} The elapsed time, in seconds, of the playing video.
 */
function getCurrentTime() {
    if (player && player.getCurrentTime) {
        var currentTime = player.getCurrentTime();
        return Math.round(currentTime * Math.pow(10, 3)) / Math.pow(10, 3);
    }
    return false;
}
/**
 * The 'getPlaybackRate' function returns the current playback rate of the
 * video shown in the player.
 * @return {string} The playback rate of the currently playing video.
 */
function getPlaybackRate() {
    if (player && player.getPlaybackRate) {
        return player.getPlaybackRate() || '';
    }
    return false;
}
/**
 * The 'getAvailablePlaybackRates' function retrieves the supported playback
 * rates for the currently playing video. It calls
 * player.getAvailablePlaybackRates().
 * @return {string} A string (comma-separated values) of available playback
 *                  rates for the currently playing video.
 */
function getAvailablePlaybackRates() {
    if (player && player.getAvailablePlaybackRates) {
        return player.getAvailablePlaybackRates();
    }
    return false;
}
// ------------------------------------------------------------------------
// Retrieving video information
// ------------------------------------------------------------------------
/**
 * The 'getDuration' function retrieves the length of the video. It calls
 * player.getDuration() function.
 * @return {number} The length of the video in seconds.
 */
function getDuration() {
    if (player && player.getDuration) {
        return player.getDuration();
    }
    return false;
}