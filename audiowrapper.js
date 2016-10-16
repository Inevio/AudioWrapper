
(function(){

  var EventEmitter = function(){
    this.events = {}
  }

  EventEmitter.prototype.on = function( event, callback ){

    if( !this.events[ event ] ){
      this.events[ event ] = []
    }

    this.events[ event ].push( callback )

  }

  EventEmitter.prototype.trigger = function( event, args ){

    if( this.events[ event ] ){

      this.events[ event ].forEach( function( handler ){
        handler.apply( null, args )
      })

    }

  }

  var Audio = function( url ){

    var eventEmitter = new EventEmitter()

    this.mediaMode = false
    this.player = null

    if( typeof Media !== 'undefined' ){

      this.mediaMode = true
      this.waitingPause = false
      this.waitingPlay = false
      this.waitingStop = false
      this.waitingStart = true

      var positionInterval = 0

      var startPositionInterval = function(){

        if( positionInterval ){
          return
        }

        positionInterval = setInterval( function(){

          this.player.getCurrentPosition( function( position ){
            eventEmitter.trigger( 'timeupdate', [ position, this.player.getDuration() ])
          }.bind(this) )

        }.bind(this), 250 )

      }.bind(this)

      var stopPositionInterval = function(){

        if( !positionInterval ){
          return
        }

        clearInterval( positionInterval )
        positionInterval = 0;

      }.bind(this)

      this.player = new Media( url, function(){
        stopPositionInterval()
        eventEmitter.trigger( 'stop', [] )
        eventEmitter.trigger( 'ended', [] )
      }, function(){
        //console.log( 'B', arguments )
      }, function( status ){

        if( Media.MEDIA_RUNNING === status && this.waitingStart ){

          this.waitingStart = false

          this.player.pause()
          eventEmitter.trigger( 'ready', [ this.player.getDuration() ])

        }

        if( Media.MEDIA_RUNNING === status && this.waitingPlay ){

          this.waitingPlay = false

          startPositionInterval()
          this.player.getCurrentPosition( function( position ){
            eventEmitter.trigger( 'play', [ position, this.player.getDuration() ])
          }.bind(this))

        }

        if( Media.MEDIA_PAUSED === status && this.waitingPause ){

          this.waitingPause = false

          stopPositionInterval()
          this.player.getCurrentPosition( function( position ){
            eventEmitter.trigger( 'pause', [ position, this.player.getDuration() ])
          }.bind(this))

        }

        if( Media.MEDIA_STOPPED === status && this.waitingStop ){

          this.waitingStop = false

          stopPositionInterval()
          this.player.getCurrentPosition( function( position ){
            eventEmitter.trigger( 'stop', [])
          }.bind(this))

        }

      }.bind(this))

      // Force load
      this.player.play()

    }else{

      this.player = $('<audio controls></audio>')

      if( typeof url === 'object' ){

        for( var i in url ){
          $('<source src="' + url[ i ].src + '" type="' + url[ i ].type + '">').appendTo( this.player )
        }

      }else{
        $('<source src="' + url + '">').appendTo( this.player )
      }

      this.player.appendTo('body')

      this.player.on( 'durationchange', function(){
        eventEmitter.trigger( 'ready', [ this.duration ] )
      })

      this.player.on( 'play',function(){
        eventEmitter.trigger( 'play', [ this.currentTime, this.duration ] )
      })

      this.player.on( 'pause',function(){
        eventEmitter.trigger( 'pause', [ this.currentTime, this.duration ] )
      })

      this.player.on( 'timeupdate', function(){

        eventEmitter.trigger( 'timeupdate', [ this.currentTime, this.duration ] )

        if( this.currentTime === 0 && this.paused ){
          eventEmitter.trigger( 'stop', [] )
        }

      })

      this.player.on( 'ended', function(){
        eventEmitter.trigger( 'stop', [] )
        eventEmitter.trigger( 'ended', [] )
      })

      this.player.on( 'stop', function(){
        eventEmitter.trigger( 'stop', [] )
      })

    }

    this.on = eventEmitter.on.bind( eventEmitter )

    return this

  }

  Audio.prototype.play = function(){

    if( this.mediaMode ){

      if( !this.waitingStart && !this.waitingPause && !this.waitingPlay && !this.waitingStop ){

        this.waitingPlay = true

        this.player.play()

      }

    }else{
      this.player[0].play()
    }

  }

  Audio.prototype.pause = function(){

    if( this.mediaMode ){

      if( !this.waitingStart && !this.waitingPause && !this.waitingPlay && !this.waitingStop ){

        this.waitingPause = true

        this.player.pause()

      }

    }else{
      this.player[0].pause()
    }

  }

  Audio.prototype.stop = function(){

    if( this.mediaMode ){

      if( !this.waitingStart && !this.waitingPause && !this.waitingPlay && !this.waitingStop ){

        this.waitingStop = true

        this.player.stop()

      }

    }else{

      this.player[0].pause()
      this.player[0].currentTime = 0

    }

  }

  Audio.prototype.seek = function( second ){

    if( this.mediaMode ){
        this.player.seekTo( parseInt( second * 1000 ) )
    }else{
      this.player[0].currentTime = second
    }

  }

  Audio.prototype.volume = function( volume ){

    if( this.mediaMode ){
      this.player.setVolume( volume.toFixed(1) )
    }else{
      this.player[0].volume = volume
    }

  }

  window.AudioWrapper = Audio

})()
