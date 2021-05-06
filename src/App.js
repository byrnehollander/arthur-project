import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import styled from 'styled-components'
import './App.css'

const SearchContainer = styled.div`
  margin-top: 40px;
`

const API_KEY = '0ecf4d5a2f7e228594521230c2f48463'
const BASE_URL = 'http://ws.audioscrobbler.com'

function App () {
  const [searchTerm, setSearchTerm] = useState('')
  const [tracks, setTracks] = useState([])
  const [albumInfo, setAlbumInfo] = useState([])
  const [mbid, setMbid] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (searchTerm?.length > 3) {
      axios.get(`${BASE_URL}/2.0/?method=track.search&track=${searchTerm}&api_key=${API_KEY}&format=json`)
        .then((result) => {
          const tracks = result?.data?.results?.trackmatches?.track
          if (tracks?.length > 1) {
            tracks.sort((a, b) => b.listeners - a.listeners)
            setTracks(tracks.slice(0, 15))
          }
        })
    }
  }, [searchTerm])

  const getAlbumInfo = (mbid) => {
    setMbid(mbid)
    axios.get(`${BASE_URL}/2.0/?method=track.getInfo&api_key=${API_KEY}&mbid=${mbid}&format=json`)
      .then((result) => {
        setAlbumInfo(result?.data?.track?.album)
      })
    handleOpen()
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const renderAlbumInfo = () => {
    if (open) {
      console.log(albumInfo)
      return (
        <>
          <div>{JSON.stringify(albumInfo)}</div>
          {/* <img src={albumInfo[0]} /> */}
        </>
      )
    }
  }

  const renderResults = () => {
    if (tracks?.length > 0) {
      return tracks.map((t, i) => {
        return (
          <Card key={i} variant='outlined' style={{ margin: 30 }}>
            <CardContent>
              <Typography color='textSecondary' gutterBottom>
                {t.artist}
              </Typography>
              <Typography variant='h5' component='h2'>
                {t.name}
              </Typography>
              {mbid === t.mbid ? renderAlbumInfo() : ''}
            </CardContent>
            <CardActions>
              <Button onClick={() => { getAlbumInfo(t.mbid) }} size='small'>Learn More</Button>
            </CardActions>
          </Card>
        )
      })
    }
  }
  return (
    <div>
      <Typography variant='h3' component='h2'>Search for a LastFM Track</Typography>
      <SearchContainer>
        <TextField id='outlined-search' label='Song name' type='search' variant='outlined' onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
      </SearchContainer>
      {renderResults()}
    </div>
  )
}

export default App
