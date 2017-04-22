import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { clone } from 'lodash';

import mulberrySymbols from '../../api/mulberry-symbols';
import Output from './Output';
import Grid from './Grid';
import AddButton from './AddButton';

require('../../styles/Board.css');
require('../../styles/Button.css');

class Board extends PureComponent {
  constructor(props) {
    super(props);
    const boards = JSON.parse(window.localStorage.getItem('boards')) || clone(this.props.boards);

    this.state = {
      activeBoard: {},
      outputValue: null,
      edit: false,
      showAddButton: false,
      boards,
    };

    this.version = '0.01';

    this.buttonTypes = {
      LINK: 'link',
      BUTTON: 'button',
    };

    this.history = [];

    this.toggleEdit = this.toggleEdit.bind(this);
    this.valueToString = this.valueToString.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onOutputClick = this.onOutputClick.bind(this);
    this.toggleAddButton = this.toggleAddButton.bind(this);
    this.handleAddButton = this.handleAddButton.bind(this);
    this.downloadBoards = this.downloadBoards.bind(this);
  }

  componentWillMount() {
    this.activateBoard(this.props.homeBoard);
  }

  activateBoard(id, history = true) {
    if (typeof id !== 'string') {
      throw (new Error('id must be of type string'));
    }

    if (history && this.state.activeBoard.id) {
      this.history.push(this.state.activeBoard.id);
    }

    const activeBoard = this.state.boards.find(board => board.id === id);
    this.setState({ activeBoard });
  }

  valueToString(value) {
    const message = value.text || value.label;
    return this.props.intl.formatMessage({ id: message });
  }

  outputToString(output) {
    return output.map(this.valueToString).join(' ');
  }

  setOutputValue(value) {
    this.setState({ outputValue: value });
    const text = this.valueToString(value);
    this.props.onOutputChange(text);
  }

  generateButtons() {
    return this.state.activeBoard.buttons.map((button, index) => {
      const { img, label } = button;
      const key = `${this.state.activeBoard.id}.${index}`;
      const buttonClasses = classNames({
        'button--link': button.link,
      });

      return (
        <button
          key={key}
          className={`button ${buttonClasses}`}
          onClick={() => { this.onButtonClick(button); }}
        >

          {img && <div className="button__symbol">
            <img className="button__image" src={img} alt="" />
          </div>}
          <span className="button__label"><FormattedMessage id={label} /></span>
        </button>
      );
    });
  }

  toggleEdit() {
    this.setState({ edit: !this.state.edit });
  }

  onBackClick() {
    const previousBoard = this.history.pop();
    previousBoard && this.activateBoard(previousBoard, false);
  }

  onButtonClick(button) {
    if (this.state.edit) { return; }

    switch (button.type) {
      case this.buttonTypes.LINK:
        this.activateBoard(button.link);
        if (button.output) { this.setOutputValue(button); }
        break;
      case this.buttonTypes.BUTTON:
        this.setOutputValue(button);
        break;
      default:
      // no default
    }
  }

  onOutputClick(output) {
    this.props.onOutputClick(this.outputToString(output));
  }

  toggleAddButton() {
    this.setState((prevState) => ({ showAddButton: !prevState.showAddButton }));
  }

  // debug symbols
  generateBoardAllSymols(from, to) {
    const boards = {
      id: 'home',
      buttons: [],
    };

    const flags = {};
    const symbolSet = mulberrySymbols.filter((symbol) => {
      const name = symbol.name.replace(/_|,_to|\d\w?/g, ' ').trim().toLowerCase();
      if (flags[name]) {
        return false;
      }
      flags[name] = true;
      return true;
    });


    for (let i = from; i < to; i++) {
      const symbol = symbolSet[i];
      if (!symbol) { break; }
      const name = symbol.name.replace(/_|, to|\d\w?/g, ' ').trim().toLowerCase();
      const src = symbol.src;
      const button = {
        type: 'button',
        label: name,
        text: '',
        img: src,
      };
      boards.buttons.push(button);
    }
    return boards;
  }

  handleAddButton(button) {
    const boards = clone(this.state.boards);
    const activeBoard = boards.find((board) => board.id === this.state.activeBoard.id);

    activeBoard.buttons.push(button);

    if (button.type === 'link' && button.link &&
      !boards.find((board) => board.id === button.link)) {
      boards.push({ id: button.link, buttons: [] });
    }
    this.setState({ boards, activeBoard });
    window.localStorage.setItem('boards', JSON.stringify(boards));
  }

  downloadBoards(event) {
    const data = `text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.state.boards))}`;
    const target = event.target;
    target.href = `data:${data}`;
  }

  render() {
    const boardClasses = classNames({
      board: true,
      'is-editing': this.state.edit,
    });
    const intl = this.props.intl;

    return (
      <div className={boardClasses}>
        {this.state.showAddButton && <AddButton
          messages={this.props.messages}
          onAdd={this.handleAddButton}
          onClose={this.toggleAddButton}
        />}
        <div className="board__output">
          <Output value={this.state.outputValue} onOutputClick={this.onOutputClick} />
        </div>

        {!this.state.edit &&
          <Toolbar>
            <ToolbarGroup firstChild>
              <IconButton
                iconClassName="material-icons"
                disabled={!this.history.length}
                onTouchTap={this.onBackClick}
              >
                arrow_back
              </IconButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ToolbarTitle text={intl.formatMessage({ id: this.state.activeBoard.id })} />
            </ToolbarGroup>

            <ToolbarGroup lastChild>
              <IconButton
                iconClassName="material-icons"
                onTouchTap={this.toggleEdit}
              >
                mode_edit
              </IconButton>
            </ToolbarGroup>
          </Toolbar>}

        {this.state.edit &&
          <Toolbar style={{ backgroundColor: '#2196f3' }}>
            <ToolbarGroup firstChild>
              <IconButton
                iconClassName="material-icons"
                onTouchTap={this.toggleAddButton}
              >
                add
              </IconButton>
            </ToolbarGroup>
            <ToolbarGroup lastChild>
              <a onClick={this.downloadBoards} download="boards.json">download</a>
              <FlatButton
                label={intl.formatMessage({ id: 'cboard.containers.Board.done' })}
                onTouchTap={this.toggleEdit}
              />
            </ToolbarGroup>
          </Toolbar>}

        <div className="board__buttons" ref={(ref) => { this.gridContainer = ref; }}>
          <Grid id={this.state.activeBoard.id} edit={this.state.edit}>
            {this.generateButtons()}
          </Grid>
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  language: PropTypes.string,
  boards: PropTypes.array.isRequired,
  onOutputClick: PropTypes.func,
  onOutputChange: PropTypes.func,
};

Board.defaultProps = {
  homeBoard: 'home',
};

export default injectIntl(Board);
