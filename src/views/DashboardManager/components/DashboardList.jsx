import React, { Component } from 'react';
import Components from 'react';
import { Route, Link } from 'react-router-dom';
import ListBar from './bar/ListBar';
import Dimensions from 'react-dimensions'

// App components
import Header from './Header';
import Container from './Container';
import DashboardCard from "../../../components/Cards/DashboardCard";

// Services
import DashboardService from './services/DashboardService';

// Our styles
import '../styles/custom.css';


const dashboardService = new DashboardService();

class DashboardList extends Component {
  constructor(props) {
    super(props);
    this.state={ 
      isOpen: false,
    };
    this.load();

    this.filter = this.filter.bind(this);
  }

  async loadImage(widget) {
    let url = 'https://datipubblici.daf.teamdigitale.it/dati-gov/v1/plot/' + widget + '/330x280';
    const response = await fetch(url, {
      method: 'GET'
    })

    return response
  }

  
  /**
   * Method called for load dashboard list
   */
  load = (config) => {
    this.state = {
      dashboards: [],
      isLoading: true
    };
    
    let response = dashboardService.list();
    response.then((list) => {
      
      this.originalDashboard = list;
      this.setState({
        dashboards: list,
        isLoading: false
      });
    });
  }

  /**
   * Execute filter
   */
  filter = (e) => {
    let key = e.target.value.toLowerCase();
    this.setState({
      dashboards: this.originalDashboard.filter((item) => item.title.toLowerCase().indexOf(key) != -1)
    });
  }

  /**
   * Render Function
   */
  render() {

    const iframeStyle = {
      width: '100%',
      height: '160px',
    }

    return this.state.isLoading === true ? <h1 className="text-center fixed-middle"><i className="fa fa-circle-o-notch fa-spin mr-2"/>Loading</h1> : (
    <Container>
      <Header title="Le Mie Dashboards" />
      
      <ListBar onChange={this.filter} history={this.props.history} ></ListBar>
      
      <div className="row">
        {
          this.state.dashboards.map((dash, index) => {
            let chartUrl = undefined
            if ((dash.widgets && dash.widgets !== '{}') && (dash.layout && dash.layout !== '{}')){
              const dashLayout = JSON.parse(dash.layout)
              let firstLayout = ''
              let preview = []
              let righe = dashLayout.rows
              for(let i = 0; i<righe.length; i++){
                let colonne = righe[i].columns;
                for(let j = 0; j<colonne.length; j++) {
                  let wids = colonne[j].widgets
                  wids.map((index) => {
                   /*  if (!index.key.startsWith('TextWidget')) { */
                    if (index.key.indexOf('TextWidget')==-1) {
                      firstLayout = index.key
                      preview.push(index.key)
                    }
                  })
                  if (firstLayout != '')
                    if(preview.length===2)
                      break
                }
                if (firstLayout != '')
                  if (preview.length === 2)
                    break
              }

              const dashWidgets = JSON.parse(dash.widgets)
              var imageA = undefined;
              var imageB = undefined;
              
              if(preview.length!==0){
                imageA = dashWidgets[preview[0]].image
                if(preview[1])
                  imageB = dashWidgets[preview[1]].image
              }

              if(firstLayout!= ''){
                const firstWidget = dashWidgets[firstLayout];
                chartUrl = firstWidget['props']['url']
              }
            }
            return (
              <DashboardCard 
                imageA = {imageA}
                imageB = {imageB}
                dash = {dash}
                />
            )
          })
        }
      </div>
      
      {
        this.state.dashboards && this.state.dashboards.length == 0 && this.state.isLoading === true &&
        <p>
          <b className="ml-20">Caricamento delle dashboard in corso...</b>
        </p>
      }
      {
        this.state.dashboards && this.state.dashboards.length == 0 && this.state.dashboards.isLoading === false &&
        <p>
          <b className="ml-20">Nessuna dashboard trovata</b>
        </p>
      }
     
    </Container>
    );
  }

}

export default DashboardList;
