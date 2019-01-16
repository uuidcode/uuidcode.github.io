class Place extends React.Component {
    render() {
        const style = {
            display: 'absolute',
            left: this.props.index * 100 + 'px',
            top: '0px',
            width: '100px',
            height: '100px',
            border: '1px solid black',
            lineHeight: '100px',
            textAlign: 'center'
        };

        return <div style={style}>{this.props.index}</div>
    }
}