import React, { Component } from 'react';
import InfiniteScroll from '../../../components/InfinityScroll';
import { serviceurl } from "../../../config/serviceurl";


class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: 6,
      visibility: 'visible'
    }
  }

  transformName(name){
    var sp1 = name.split('_o_')
    if(sp1[1])
    return sp1[1]
    else 
    return name
  }

  loadMore = () => {
    if (this.state.isLoading) { return }
    var totitems = this.state.items + 1;
    this.setState({ items: totitems, visibility: 'hidden'});
  }

  handleScrollToBottom = () => this.loadMore()
  handleLoadMoreClick = () => this.loadMore()

  render() {
    const { visibility, items, isLoading } = this.state;
    const { widgets, isModalOpen, onRequestClose, onWidgetSelect } = this.props;
    let visible = widgets.length<=items ? 'hidden':visibility;
    var count = 0;
    const widgetItems = widgets.map((widget, key) => {
      if(count<items){
        count++;
        if(widget.viz_type==="textwidget"){
          return(
            <div className="infinity-iframe-100" key={key}>
              <div className="card text-center">
                <div className="card-body">
                  <a className="list-group-item" onClick={() => onWidgetSelect(widget)}>
                  <h6 className="list-group-item-heading">
                  <i className="fa fa-font" aria-hidden="true"></i>  
                    {" "+widget.title}
                  </h6>
                  </a>
                </div>
              </div>
            </div>
          )
        }else{
          return (
              <div className="infinity-iframe-50" key={key}>
                  <div className="card text-center">
                      <div className="card-body">  
                
                        <a className="list-group-item" onClick={() => onWidgetSelect(widget)}>
                          <h6 className="list-group-item-heading" id={"title-preview-" + key}>
                      {" [" + this.transformName(widget.table) + "] " + widget.title}
                          </h6>
                          <div className="preview-widget">
                            <div style={{width: '100%'}}>
                              <img src={serviceurl.urlCacher +widget.identifier+'.png'} />
                            </div>
                          </div>
                        </a>
                  </div>
                </div>
              </div>
            )
        }
      }
    });
    return (
      <InfiniteScroll onScrollToBottom={this.handleScrollToBottom} className="d-flex flex-wrap">
        {widgetItems}
        <button
          className="List-load-more-button"
          onClick={this.handleLoadMoreClick}
          disabled={isLoading} style={{visibility: visible }}>
          {isLoading ? 'Caricamento...' : 'Altri'}
        </button>
      </InfiniteScroll>
    );
  }
}

export default List;
