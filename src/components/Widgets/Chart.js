import React, { Component } from 'react';
import { 
  ResponsiveContainer,
  AreaChart, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Area, 
  Tooltip, 
  ReferenceLine, 
  Bar, 
  BarChart, 
  Legend, 
  LineChart, 
  Line,
  ComposedChart,
  Pie,
  PieChart,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Label,
  LabelList,
  Scatter,
  ScatterChart,
  Treemap
} from 'recharts'
import ReactTable from "react-table"


const colors = ['#4a8523','#68f5c8','#acadc1','#dd4c63','#b415ab','#c4aa30','#223373','#3523d1']

class Chart extends Component{
  constructor(props){
    super(props)

    this.conditionalChartRender = this.conditionalChartRender.bind(this)
  }

  conditionalChartRender(type, data, dataVisualization, xAxis){
    switch (type) {
      case 'areachart':
        return(
          <AreaChart width={800} height={274} data={data}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey={xAxis}/>
            <YAxis/>
            <Tooltip/>
            {dataVisualization.map((elem, index)=> {
              return(
                <Area type='monotone' dataKey={elem.dataKey} stroke={elem.color} fill={elem.color} key={index}/>
                )
              })
            }
          </AreaChart>
        )
        break;
      case 'barchart':
        return(
          <BarChart width={800} height={274} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataVisualization.map((elem, index)=> {
              return(
                <Bar dataKey={elem.dataKey} fill={elem.color} key={index}/>
                )
              })
            }
          </BarChart>
        )
        break;
      case 'linechart':
          return(
            <LineChart width={800} height={274} data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataVisualization.map((elem, index)=> {
                return(
                  <Line type='monotone' dataKey={elem.dataKey} stroke={elem.color} key={index}/>
                  )
                })
              }
            </LineChart>
          )
          break;
      case 'composedchart':
          return(
            <ComposedChart width={800} height={274} data={data}>
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="pv" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            </ComposedChart>
          )
          break;
      case 'piechart':
          return(
            <PieChart width={800} height={274}>
              <Pie data={data} dataKey={dataVisualization[0].dataKey} nameKey={xAxis} cx="50%" cy="50%" outerRadius={100}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]}/>
                ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )
          break;
      case 'radarchart':
          return(
            <RadarChart outerRadius={90} width={800} height={274} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xAxis} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              {dataVisualization.map((elem, index)=> {
                return(
                  <Radar name={elem.dataKey} dataKey={elem.dataKey} stroke={elem.color} fill={elem.color} fillOpacity={0.6} key={index}/>
                  )
                })
              }              
              <Legend />
            </RadarChart>
          )
          break;
      case 'radialbarchart':
          return(
            <RadialBarChart width={800} height={274} innerRadius="20%" outerRadius="90%" data={data} startAngle={180} endAngle={0}>
              <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey={dataVisualization[0].dataKey} >
              {
                data.map((entry, index) => (
                  <Cell  key={`cell-${index}`} fill={colors[index]}/>
                  ))
              }
              </RadialBar>
              <Legend iconSize={10} width={120} height={140} layout='horizontal' verticalAlign='middle' align="right" />
              <Tooltip />
            </RadialBarChart>
          )
          break;
      case 'scatterchart':
          return(
            <ScatterChart width={800} height={274}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis dataKey="uv" />
              <ZAxis dataKey="amt" range={[64, 144]} name="amount" unit="MB" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Pages weight" data={data} fill="#8884d8" />
            </ScatterChart>
          )
          break;
      case 'treemap':
          return(
            <Treemap
              width={800} 
              height={274}
              data={data}
              dataKey="amt"
              ratio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
            <Tooltip/>
            </Treemap>
          )
          break;
      default:
          return(
            <LineChart width={800} height={274} data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          )
          break;
    }
  }

  render(){
    const { data, xAxis, dataVisualization, type } = this.props

    var widType = type===''?'table':type

    if(type === '' || type === 'table'){
      if(data.length>0){
        var columns=[{
          Header: "Tabella risultante",
          columns: []
        }]
        Object.keys(data[0]).map(elem=>{
          columns[0].columns.push({
            Header: elem,
            accessor: elem
          })
        })
        return(
          <ReactTable 
            data={data}
            columns={columns}
            defaultPageSize={10}
            className="-striped -highlight mb-4"
            />
        )
      }else{
        return(<p>Nessun dato disponibile</p>)
      }
    }else{
      return(
        <ResponsiveContainer width={'100%'} height={400}>
          {this.conditionalChartRender(widType, data, dataVisualization, xAxis)}
        </ResponsiveContainer>
      )
    }
  }
}

export default Chart

/* chartOptions :{
  xAxis: type.String
  dataVisualization : [{datakey: type.String, color:type.String},...]
  scatterchart && scatterVisualization: {yAxis: type.String, zAxis: type.String}
  showCartesian: type.boolean
} */