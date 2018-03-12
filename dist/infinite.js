"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _noop = require("./noop");

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Infinite = function (_Component) {
    _inherits(Infinite, _Component);

    function Infinite(props) {
        _classCallCheck(this, Infinite);

        var _this = _possibleConstructorReturn(this, (Infinite.__proto__ || Object.getPrototypeOf(Infinite)).call(this, props));

        _this.scrollEventHandler = function (event) {
            var scroll_y = _this.getScrollY(),
                parent_height = _this.getParentVisibleHeight(),
                content_height = _this.element.scrollHeight;

            var threshold = _this.props.threshold,
                directions = _this.props.directions,
                handler = _this.props.handler;

            // Load Down
            if (scroll_y + parent_height >= content_height - threshold && directions.includes("down") && !_this.loading.down) {
                _this.loading.down = true;

                Promise.resolve(handler({ direction: "down" })).then(function () {
                    _this.loading.down = false;
                });
            }

            // Load Up
            if (scroll_y <= threshold && directions.includes("up") && !_this.loading.up) {
                _this.loading.up = true;

                Promise.resolve(handler({ direction: "up" })).then(function (valid) {
                    _this.loading.up = false;

                    if (valid) _this.parentElement.scrollBy(0, _this.element.scrollHeight - content_height);
                });
            }
        };

        _this.loading = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        _this.parentElement;
        _this.element;
        _this.scrollEventHandler;
        return _this;
    }

    _createClass(Infinite, [{
        key: "getScrollY",
        value: function getScrollY() {
            return this.props.useWindow ? window.scrollY - this.element.offsetTop : this.parentElement.scrollTop - this.element.offsetTop;
        }
    }, {
        key: "getParentVisibleHeight",
        value: function getParentVisibleHeight() {
            return this.props.useWindow ? window.innerHeight : this.parentElement.offsetHeight;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.element = _reactDom2.default.findDOMNode(this);
            this.parentElement = this.element.parentElement;

            if (this.props.useWindow) this.parentElement = window;

            this.scrollEventListener = this.parentElement.addEventListener("scroll", this.scrollEventHandler);
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            this.scrollEventHandler();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.parentElement.removeEventListener("scroll", this.scrollEventListener);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                this.props.children
            );
        }
    }]);

    return Infinite;
}(_react.Component);

Infinite.propTypes = {
    useWindow: _propTypes2.default.bool,
    threshold: _propTypes2.default.number,
    directions: _propTypes2.default.arrayOf(_propTypes2.default.string),
    handler: _propTypes2.default.func.isRequired
};
Infinite.defaultProps = {
    useWindow: false,
    threshold: 100,
    directions: ["down"],
    handler: _noop.noop
};
exports.default = Infinite;
