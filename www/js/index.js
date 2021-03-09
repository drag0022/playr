/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

const APP = {
    tracks: [
        {
            id: 100,
            artist: "Daft Punk",
            album: "Discovery",
            track: "One More Time",
            length: 320,
            path: "media/one-more-time.mp3",
            artPath: "https://i.ibb.co/BNtbxb4/discovery.jpg"
        },
        {
            id: 102,
            artist: "Daft Punk",
            album: "Random Access Memories",
            track: "Instant Crush",
            length: 340,
            path: "media/instant-crush.mp3",
            artPath: "https://i.ibb.co/YtBPq0r/ram.jpg"
        },
        {
            id: 204,
            artist: "Daft Punk",
            album: "Homework",
            track: "Da Funk",
            length: 329,
            path: "media/da-funk.mp3",
            artPath: "https://i.ibb.co/MCT4Q6c/homework.jpg"
        },
        {
            id: 589,
            artist: "The Weeknd",
            album: "Starboy",
            track: "I feel It Coming",
            length: 269,
            path: "media/i-feel-it-coming.mp3",
            artPath: "https://i.ibb.co/cygYrcr/Screen-Shot-2021-03-07-at-3-56-18-PM.png"
        },
        {
            id: 207,
            artist: "Daft Punk",
            album: "TRON: Legacy",
            track: "Derezzed",
            length: 176,
            path: "media/derezzed.mp3",
            artPath: "https://i.ibb.co/gDTgkcw/tron9.jpg"
        },
        {
            id: 301,
            artist: "Daft Punk",
            album: "Random Access Memories",
            track: "Giorgio by Moroder",
            length: 554,
            path: "media/giorgio-by-moroder.mp3",
            artPath: "https://i.ibb.co/YtBPq0r/ram.jpg"
        }
    ],
    media: null,
    song: null,
    isPlaying: true,
    currentTime: null,
    init(){
        APP.getTracks()
        APP.listeners()
    },
    getTracks(){
        APP.tracks.forEach(song => {
            APP.buildTrackHTML(song)
        })
    },
    listeners(){

        document.querySelectorAll('.cardContainer').forEach(card => {
            card.addEventListener('click', APP.playSong)
        })

        document.querySelector('.backwardsButton').addEventListener('click', APP.mediaRewind)
        document.querySelector('.forwardsButton').addEventListener('click', APP.mediaForward)
    },
    buildTrackHTML(song){
        const pageBody = document.querySelector('#home > .pageBody')
        const df = new DocumentFragment()

        const cardParent = document.createElement('div')
        cardParent.classList.add('cardParent')
        cardParent.innerHTML = `<a class="cardContainer" href="#" data-page="player" data-id=${song.id}>
                                <div class="songArtContainer">
                                    <img id="image" src="${song.artPath}"></img>
                                </div>
                                <div class="songDescriptionContainer">
                                    <p>${song.artist}</p>
                                    <p class="songTitle">${song.track}</p>
                                    <p class="songAlbum">${song.album}</p>
                                </div>
                                </a>`
        df.append(cardParent)
        pageBody.append(df)
    },
    playSong(ev){
        //Slide player from bottom of page
        APP.playerAnimation()
        //get song ID and build HTML
        let songId = null
        if(ev){
            songId = parseInt(ev.currentTarget.dataset.id)
            const song = APP.tracks.find(song => song.id === songId)
            APP.song = song
            console.log(APP.song)
        } else {
            songId = APP.song.id
            console.log(APP.song)
        }
        APP.buildPlayerHTML()
        document.querySelector('.backwardsButton').addEventListener('click', APP.mediaRewind)
        document.querySelector('.forwardsButton').addEventListener('click', APP.mediaForward)
        //mount media
        APP.mountMedia()
        APP.mediaPlay()
        APP.songSlider()
        //switch from play button to pause 
        const playButton = document.querySelector('.playButton')
        playButton.classList.remove('playButton')
        playButton.classList.add('pauseButton')
        playButton.addEventListener('click', ()=>{
            if (playButton.classList.contains('playButton')){
                APP.mediaPlay()
                playButton.classList.remove('playButton')
                playButton.classList.add('pauseButton')
                APP.isPlaying = true
            } else {
                APP.mediaPause()
                playButton.classList.remove('pauseButton')
                playButton.classList.add('playButton')
                APP.isPlaying = false
            }
        })  
    },
    playerAnimation(){
        const player = document.querySelector('#player')
        player.classList.remove('playerDown')
        player.classList.add('playerUp')

        const topMenu = document.querySelector('#home > .topNav')
        topMenu.addEventListener('click', ()=>{
            player.classList.remove('playerUp')
            player.classList.add('playerDown')
        })
    },
    buildPlayerHTML(){
        if (APP.media){ // if song is already playing, stop it
            APP.media.stop()
        }
        const pageBody = document.querySelector('#player > .pageBody')
        pageBody.innerHTML= ""
        const playerContainer = document.createElement('div')
        playerContainer.classList.add('playerContainer')
        const df = new DocumentFragment()

        playerContainer.innerHTML = `<div class="playerSongArtContainer">
                                        <img id="image" class="songPlaying" src="${APP.song.artPath}"></img>
                                    </div>
                                    <div class="playerSongDescriptionContainer">
                                        <p>${APP.song.artist}</p>
                                        <div class="playerSongTitle"><p>${APP.song.track}</p></div>
                                        <div class="playerSongAlbum"><p>${APP.song.album}</p></div>
                                    </div>
                                    <div class="songSliderContainer">
                                        <div class="songCurrentTime"></div>
                                        <div class="songSlider"></div>
                                        <div class="songLength"></div>
                                    </div>
                                    <div class="playerControlsContainer">
                                        <div class="backwardsButton"></div>
                                        <div class="playButton"></div>
                                        <div class="forwardsButton">
                                    </div>`
        df.append(playerContainer)
        pageBody.append(df)
    },
    mountMedia(){
        APP.media = new Media(
            APP.song.path, 
            APP.songPlayingSuccess, 
            APP.songPlayingError, 
            APP.songStatus)   
    },
    mediaPlay(){
        APP.media.play()
        //trigger play animation
        const img = document.querySelector('.playerSongArtContainer > #image')
        img.classList.add('songPlaying')
    },
    mediaPause(){
        APP.media.pause()
        const img = document.querySelector('.playerSongArtContainer > #image')
        img.classList.remove('songPlaying')
    },
    mediaForward(){
        APP.media.getCurrentPosition((currentPosition)=>{
            const maxPosition = APP.media.getDuration()
            const newPosition = Math.min(maxPosition, currentPosition + 10)
            APP.media.seekTo(newPosition * 1000)
            APP.currentTime += 10
        })
    },
    mediaRewind(){
        APP.media.getCurrentPosition((currentPosition)=>{
            const minPosition = 0
            const newPosition = Math.max(minPosition, currentPosition - 10)
            APP.media.seekTo(newPosition * 1000)
            if(APP.currentTime - 10 <= 0) APP.currentTime -= 10
        })
    },
    playNext(){
            // when song is over
            APP.tracks.forEach((track, index) => {  // find song position in original track list
                if (APP.song.id === track.id){
                    console.log({track, index})
                    APP.song = APP.tracks[index + 1]
                    // update the global track to be the next one in track list
                    APP.playSong()
                    
                }
                
            })
    },
    songPlayingSuccess() {
        console.log('playing song')
    },
    songPlayingError(err) {
        console.log({err})
    },
    songStatus(status){
        console.log(status)
    },
    convertTime(time){
        const minutes= Math.floor(time / 60)
        const seconds = time % 60
        if (seconds >= 10){
            return `${minutes}:${seconds}`
        } else {
            return `${minutes}:0${seconds}`
        }
    },
    songSlider(){
        const songLength = document.querySelector('.songLength')
        
        console.log(APP.song)
        APP.currentTime = 0
        const songCurrentTime = document.querySelector('.songCurrentTime')
        const slider = document.querySelector('.songSlider')
        setInterval(()=>{
            
            songLength.textContent = APP.convertTime(APP.song.length)
            if((APP.currentTime < APP.song.length) && (APP.isPlaying == true)){
                APP.currentTime++
                songCurrentTime.textContent = APP.convertTime(APP.currentTime)
                let percent = (APP.currentTime / APP.song.length) * 100
                slider.style.background = `linear-gradient(90deg, rgba(41,41,41,1) ${percent}%, rgba(29,29,29,1) ${percent}%)`
            }
            
            if(APP.currentTime >= APP.song.length){
                APP.playNext()
            }
        }, 1000)
    
    }
} 



document.addEventListener('deviceready', APP.init, false);

