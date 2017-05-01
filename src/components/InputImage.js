import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import getOrientedImage from 'exif-orientation-image';

const photoCameraIcon = <FontIcon className="material-icons" style={{ color: '#fff' }}>photo_camera</FontIcon>;

const styles = {
  imageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

class InputImage extends PureComponent {
  constructor(props) {
    super(props);
    const { src } = props;
    this.state = { src };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src === nextProps.src) { return; }
    this.setState({ src: nextProps.src });
  }

  handleChange = (event) => {
    const file = event.target.files[0];

    getOrientedImage(file, (error, canvas) => {
      if (!error) {
        const dataURL = canvas.toDataURL('image/png');
        this.setState({ src: dataURL });
        this.props.onChange(dataURL);
      }
    });
    this.input.value = '';
  }

  render() {
    const { src } = this.state;

    return (
      <div className="image-placeholder">
        {src && <img src={src} alt="" />}
        {photoCameraIcon}
        <input id="input-file-image" type="file" style={styles.imageInput} onChange={this.handleChange} ref={(input) => { this.input = input; }} />
      </div>
    );
  }
}

export default InputImage;

InputImage.propTypes = {
  src: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

InputImage.defaultProps = {
  src: '',
};
