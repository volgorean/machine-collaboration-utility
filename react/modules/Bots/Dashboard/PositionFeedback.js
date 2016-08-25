import React from 'react';
import request from 'superagent';
import _ from 'underscore';

export default class PositionFeedback extends React.Component {
  constructor(props) {
    super(props);

    this.zeroAxis = this.zeroAxis.bind(this);
  }

  zeroAxis(inputAxes) {
    const endpoint = `/v1/bots/${this.props.bot.settings.uuid}`;

    const axes = { x: false, y: false, z: false };
    _.extend(axes, inputAxes);
    let gcode = '';
    if (axes.x) {
      gcode = 'G92 X0';
    } else if (axes.y) {
      gcode = 'G92 Y0';
    } else if (axes.z) {
      gcode = 'G92 Z0';
    }

    request.post(endpoint)
    .send({ command: `processGcode` })
    .send({ gcode })
    .set('Accept', 'application/json')
    .end();
  }

  render() {
    const position = this.props.bot.status && this.props.bot.status.position ?
      this.props.bot.status.position : { x: '?', y: '?', z: '?', e: '?' };
    return (
      <div>
        <h3>POSITIONING</h3>
        <div className="col-sm-4">
          <h5>X-Axis</h5>
          <div>{Number(Number(position.x) - Number(this.props.bot.settings.offsetX)).toFixed(3)}</div>
          <button onClick={() => { this.zeroAxis({ x: true }) } }>Zero X</button>
        </div>
        <div className="col-sm-4">
          <h5>Y-Axis</h5>
          <div>{Number(Number(position.y) - Number(this.props.bot.settings.offsetY)).toFixed(3)}</div>
          <button onClick={() => { this.zeroAxis({ y: true }) } }>Zero Y</button>
        </div>
        <div className="col-sm-4">
          <h5>Z-Axis</h5>
          <div>{Number(Number(position.z) - Number(this.props.bot.settings.offsetZ)).toFixed(3)}</div>
          <button onClick={() => { this.zeroAxis({ z: true }) } }>Zero Z</button>
        </div>
      </div>
    );
  }
}
