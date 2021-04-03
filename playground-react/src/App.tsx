import * as React from 'react';
import './App.css';

import Chart from './Chart';
import logo from './logo.svg';
import {xViewer} from './xBIM';

type bimColor = 'purple' | 'yellow' | 'orange';


class App extends React.Component {
  private xviewer: any;

  // xviewer color styles
  private styles: Array<{id: number, color: bimColor, value: number[]}> = [
    { id: 1, color: 'purple', value: [156, 39, 176, 255]},
    { id: 2, color: 'yellow', value: [255, 235, 59, 255] },
    { id: 3, color: 'orange', value: [255, 87, 34, 255] },
  ]

  public componentDidMount() {
    this.xviewer = new xViewer('viewer');
    this.xviewer.load('bim/SampleHouse.wexbim');
    this.xviewer.start();
    this.xviewer.on('loaded', () => {
      console.log(this.xviewer);
      this.xViewerEventBinding();
      this.initialXViewerColorStyle();
    });
  }
  public render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <canvas id="viewer" width="500" height="300"/>
        <div>
          <span id="productId"/>
        </div>
        <br/>
        <Chart/>
      </div>
    );
  }

  private initialXViewerColorStyle() {
    this.styles.forEach((c) => {
      this.xviewer.defineStyle(c.id, c.value);
    });
  }
  private getStyleId(color: bimColor) {
    const findedStyle = this.styles.find(c => c.color === color);
    if(findedStyle) {
      return findedStyle.id;
    }
    return undefined;
  }

  private xViewerEventBinding() {
    let timer = 0;
    this.xviewer.on('pick', (args: any) => {
      const id = args.id;

      // feature 1, zoom in
      const span = document.getElementById('productId');
      (span as HTMLElement).innerHTML = id;
      const time = (new Date()).getTime();
      if (time - timer < 200) {
        this.xviewer.zoomTo(id);
      }
      timer = time;

      // state setting
      // HIDDEN: 254
      // HIGHLIGHTED: 253
      // UNDEFINED: 255
      // UNSTYLED: 225
      // XRAYVISIBLE: 252

      // feature 2, highlight & unhighlight
      // const currentState = this.xviewer.getState(id);
      // if(currentState === 253) {
      //   this.xviewer.setState(255, [id]);
      // } else {
      //   this.xviewer.setState(253, [id]);
      // }


      // feature 3, colouring
      // the initial style of product can be 255, the default style of a product is 225
      if (this.xviewer.getStyle(id) === 255 || this.xviewer.getStyle(id) === 225) {
        this.xviewer.setStyle(this.getStyleId('yellow'), [id]);
      } else {
        this.xviewer.setStyle(225, [id]);
      }
    });

    // feature 1, zoom in
    this.xviewer.on('mouseDown', (args: any) => {
      this.xviewer.setCameraTarget(args.id);
    });
  }
}

export default App;
