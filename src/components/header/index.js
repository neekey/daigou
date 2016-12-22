import React from 'react';
import { Link } from 'react-router';
import { Menu, Icon, Search } from 'semantic-ui-react';
import style from './header.scss';
import pagesLink from './header.json';


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
        <Icon
          className={style.headerIcon}
          name={this.state.open ? 'close' : 'content'}
          size="large"
          onClick={this.toggleMenuOpen} />
        <span className={style.headerTitle}>Neekey 澳洲直邮代购</span>
        <Icon className={style.headerSearchIcon} name="search" size="large" />
        <Search className={style.headerSearch} />
      </div>
      <Menu vertical secondary className={style.menu}>
        {pagesLink.map(item => (<Menu.Item
          key={item.name}
          className={style.menuItem}
          as={Link}
          name={item.name}
          activeClassName="active"
          onClick={this.handleItemClick}
          to={{
            pathname: '/list',
            query: { ...item },
          }} />))}
      </Menu>
    </div>);
  }
}

Header.propTypes = {
  children: React.PropTypes.node,
  activeIndex: React.PropTypes.number,
};
