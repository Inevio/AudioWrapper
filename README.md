# AudioWrapper
Same API for HTML5 &lt;audio> and Cordova Media Plugin

## Constructor
```js
var audio = new AudioWrapper( 'http://mysite.com/fileUrl' )
```

## Methods
### `play()`
Starts or resumes playing an audio file.
```js
audio.play();
```

### `pause()`
Pauses playing an audio file.
```js
audio.pause();
```

### `stop()`
Stops playing an audio file.
```js
audio.stop();
```

### `seek( Float second )`
Sets the current position within an audio file.
```js
audio.seek( 42 );
```

### `volume( Float volume )`
Set the volume for an audio file. The value must be within the range of 0.0 to 1.0.
```js
audio.setVolume( 0.5 );
```

### `remove()`
Remove the underlying operating system's audio resources. This is particularly important for mobile devices. Applications should call the release function for any Media resource that is no longer needed.
```js
audio.remove();
```

### `on( String eventName, Function handlerFn )`
Set a listener for the object events.

## Events
### `.on( 'ready', function( Float duration ){}`
### `.on( 'play', function( Float current, Float duration ){}`
### `.on( 'pause', function( Float current, Float duration ){}`
### `.on( 'stop', function( Float duration ){}`
### `.on( 'endend', function( Float duration ){}`
### `.on( 'timeupdate', function( Float current, Float duration ){}`
