import { Component } from "react";
import { noop } from "./noop";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Infinite extends Component {
    static propTypes = {
        useWindow:    PropTypes.bool,
        threshold:    PropTypes.number,
        directions:   PropTypes.arrayOf(PropTypes.string),
        handler:      PropTypes.func.isRequired,
    };

    static defaultProps = {
        useWindow:    false,
        threshold:    100,
        directions:   ["down"],
        handler:      noop,
    }

    constructor(props) { super(props);
        this.loading = {
            up:      false,
            down:    false,
            left:    false,
            right:   false,
        };

        this.parentElement;
        this.element;
        this.scrollEventHandler;
    }

    getScrollY() {
        return this.props.useWindow ?
            window.scrollY - this.element.offsetTop :
            this.parentElement.scrollTop - this.element.offsetTop;
    }

    getParentVisibleHeight() {
        return this.props.useWindow ?
            window.innerHeight :
            this.parentElement.offsetHeight;
    }

    scrollEventHandler = (event) => {
        const scroll_y         = this.getScrollY(),
              parent_height    = this.getParentVisibleHeight(),
              content_height   = this.element.scrollHeight;

        const threshold    = this.props.threshold,
              directions   = this.props.directions,
              handler      = this.props.handler;

        // Load Down
        if (scroll_y + parent_height >= content_height - threshold &&
        directions.includes("down") && !this.loading.down) {
            this.loading.down = true;

            Promise.resolve(handler({ direction: "down" }))
                .then(() => {
                    this.loading.down = false
                });
        }

        // Load Up
        if (scroll_y <= threshold && directions.includes("up") && !this.loading.up) {
            this.loading.up = true;

            Promise.resolve(handler({ direction: "up" }))
                .then((valid) => {
                    this.loading.up = false;

                    if (valid)
                        this.parentElement.scrollBy(0, this.element.scrollHeight - content_height);
                });
        }
    }

    componentDidMount() {
        this.element         = ReactDOM.findDOMNode(this);
        this.parentElement   = this.element.parentElement;

        if (this.props.useWindow)
            this.parentElement = window;

        this.scrollEventListener = this.parentElement
            .addEventListener("scroll", this.scrollEventHandler);
    }

    componentDidUpdate() {
        this.scrollEventHandler();
    }

    componentWillUnmount() {
        this.parentElement.removeEventListener("scroll", this.scrollEventListener);
    }

    render() {
        return (<div>
            {this.props.children}
        </div>)
    }
}