import React from 'react';
import { Link } from 'react-router';
import style from './header.scss';
import pagesLink from './header.json';
import classnames from 'classnames';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleMenuOpen = this.toggleMenuOpen.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  scrollToTop() {
    document.body.scrollTop = 0;
  }

  toggleMenuOpen() {
    this.setState({
      open: !this.state.open,
    });
  }

  handleItemClick() {
    this.scrollToTop();
    this.toggleMenuOpen();
  }

  handleContainerClick(event) {
    if (event.target === event.currentTarget) {
      this.toggleMenuOpen();
    }
  }

  render() {
    return (<div
      onClick={this.handleContainerClick}
      className={this.state.open ? style.containerOpen : style.container}>
      <div className={style.header}>
        <i
          className={classnames(
            style.headerIcon,
            this.state.open ? 'fa fa-close' : 'fa fa-bars')}
          onClick={this.toggleMenuOpen} />
        <span className={style.headerTitle}>Neekey 澳洲直邮代购</span>
      </div>
      <div className={style.menu}>
        {pagesLink.map((item, index) => (<Link
          key={item.name}
          className={style.menuItem}
          activeClassName={style.menuItemActive}
          to={item.path ? item.path : `/list/${index}`}
          onClick={this.handleItemClick}>{item.name}</Link>))}
      </div>
    </div>);
  }
}

Header.propTypes = {
  children: React.PropTypes.node,
  activeIndex: React.PropTypes.number,
};
