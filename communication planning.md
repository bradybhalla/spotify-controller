# Communication

## Things that need to happen
1) ~~Song searching~~
2) ~~Song adding, removing, updating~~
3) ~~Song playing changes~~
4) ~~New user added~~
5) ~~User removed~~
6) *Pause, play, skip?*, probably in the node terminal
7) Update everything when reconnecting

## Server $\to$ Client

### Sockets
  - Send API Key that the client must use to access the api (on reciept of "user-info")
    - "api-key"
    - ```typescript
      type = APIKey
      ```
  - New user connects
    - "new-user"
    - ```typescript
      type = NewUserData
      ```

  - User removed
    - "remove-user"
    - ```typescript
      type = UserChangeData
      ```

  - New song added
    - "enqueue-song"
    - ```typescript
      type = NewSongData
      ```

  - Queue modified
    - "modify-queue"
    - ```typescript
      type = SingleQueue
      ```

  - Playing song change
    - "change-playing-song"
    - ```typescript
      type = PlayingSong
      ```

## Client $\to$ Server


### Sockets
  - ~~Send user information (on connection)~~
    - "user-info"
    - ```typescript
      type = User
      ```
  - Add song to queue
    - "enqueue-song"
    - ```typescript
      type = Song
      ```

  - Modify queue
    - "modify-queue"
    - ```typescript
      type = Song[]
      ```

### API

  - Search for `songs`
    - "/api/search"
    - ```typescript
      type = SearchQuery & APIKey // send
      type = Song[] // recieve
      ```
  - Get current song
    - "/api/currSong"
    - ```typescript
      type = APIKey // send
      type = PlayingSong // recieve
      ```
  - Get current queue info
    - "/api/queue"
    - ```typescript
      type = APIKey // send
      type = EntireQueue // recieve
      ```
