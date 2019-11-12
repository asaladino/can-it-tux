import React, { useEffect, useState } from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DevicesRepository from '../repositories/DevicesRepository';

import _ from 'lodash';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import ReactMarkdown from 'react-markdown';
import { Link } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
  mediaDialog: {
    height: 400,
  },
  results: {
    margin: theme.spacing(2),
  },
  offset: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(2.4, 2.4, 2.4, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    minWidth: 120
  },
}));

const App = () => {
  const classes = useStyles();
  const developers = ['ubports', 'leste', 'pmos', 'asteroid'];
  const types = {
    'watch': ['watch'],
    'phone': ['fone', 'phone', 'Moto G (2014)D', '5', '4'],
    'tablet': ['7', '10', 'pad'],
    'tv': ['tv'],
    'devkit': ['devkit'],
    'devboard': ['pi'],
    'unknown': []
  };
  const [devices, setDevices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [status, setStatus] = useState('everything');
  const [type, setType] = useState('everything');
  const [search, setSearch] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const devicesRepository = new DevicesRepository(developers, types);
    devicesRepository.findAll().then(devicesToLoad => {
      setDevices(devicesToLoad);
      const statusesToLoad = _.uniq(devicesToLoad.map(device => device.status));
      setStatuses(statusesToLoad);
    });
  }, []);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = (device) => {
    setDevice(device);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return <div className={classes.root}>
    <AppBar position="fixed" color="default">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Can It Linux?
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            value={search ? search : ''}
            onChange={handleSearchChange}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
        <FormControl variant="filled" className={classes.formControl}>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            onChange={handleStatusChange}>
              <MenuItem value={'everything'}>All Statuses</MenuItem>)
              {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl variant="filled" className={classes.formControl}>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={type}
            onChange={handleTypeChange}>
              <MenuItem value={'everything'}>All Types</MenuItem>)
              {Object.keys(types).map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </Select>
        </FormControl>
        <div className={classes.grow} />
      </Toolbar>
    </AppBar>
    <div className={classes.offset} />
    <div className={classes.offset} />
    <div className={classes.results}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {devices.filter(device => search === null || device.name.toLowerCase().includes(search))
                  .filter(device => status === 'everything' || device.status === status)
                  .filter(device => type === 'everything' || device.type === type).map(device => {
            return <Grid item xs={12} sm={6} md={4} lg={3} key={device.id}>
              <Card className={classes.card} onClick={() => handleClickOpen(device)}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={device.picture ? device.picture : '/img/unknown.png'}
                    title={device.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2" noWrap={true}>
                      {device.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Chip label={device.status} />
                  <Chip label={device.type} />
                </CardActions>
              </Card>

            </Grid>
          })}
        </Grid>
      </Container>

      <Dialog
        open={open}
        fullWidth={true}
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{device ? device.name : 'Not Selected'}</DialogTitle>
        <DialogContent>
            <CardMedia
                    className={classes.mediaDialog}
                    image={device ? device.picture : '/img/unknown.png'}
                    title={device ? device.name : ''} />
          <DialogContentText id="alert-dialog-slide-description">
            <ReactMarkdown source={device ? device.text : ''} />
            
            {device ? <div>
                <Chip label={device.status} />
                <Chip label={device.type} />
              </div>
            : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {device ? <Link href={device.link} target='_blank'>
            More Info
          </Link> : null}
          
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  </div>
}

export default App;
