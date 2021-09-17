/* eslint-disable react/prop-types */
import {
  Avatar,
  ButtonGroup,
  Collapse,
  Divider,
  Drawer,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import React, { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";
import HelpIcon from "@material-ui/icons/Help";
import { useStyles } from "./Navbar.styles";
import { getPath } from "@/utils/path";
import Link from "next/link";
import { externlinks } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isDrawerCollapsed, extensionsNavigator, categories, onDrawerCollapse }) => {
  const classes = useStyles();
  const [hoveredId, setHoveredId] = useState(null);
  const [openItems, setOpenItems] = useState([]);
  const [showHelperButton, setShowHelperButton] = useState(false);

  let classname;
  if (isDrawerCollapsed) {
    classname = classes.collapseButtonWrapperRotated;
  } else {
    classname = classes.collapseButtonWrapper;
  }

  const handleTitleClick = () => null;
  const toggleItemCollapse = (id) => {
    const activeItems = [...openItems];
    if (openItems.includes(id)) {
      setOpenItems(activeItems.filter((item) => item !== id));
    } else {
      activeItems.push(id);
      setOpenItems(activeItems);
    }
  };
  const toggleSpacing = () => {
    setShowHelperButton((prev) => !prev);
  };

  const toggleMiniDrawer = () => {
    onDrawerCollapse();
  };

  /**
   * Renders `Link` based on the information available
   * @param {import("react").ReactElement} iconc
   * @param {string} titlec
   * @param {string} hrefc
   * @param {boolean} linkc
   * @param {boolean} drawerCollapsed
   * @returns {import("react").ReactElement} Link
   */
  const linkContent = (iconc, titlec, hrefc, linkc, drawerCollapsed) => {
    let linkContent = (
      <div className={classNames(classes.link)}>
        <Tooltip
          title={titlec}
          placement="right"
          disableFocusListener={!drawerCollapsed}
          disableHoverListener={!drawerCollapsed}
          disableTouchListener={!drawerCollapsed}
        >
          <ListItemIcon className={classes.listIcon}>{iconc}</ListItemIcon>
        </Tooltip>
        <ListItemText
          className={drawerCollapsed ? classes.isHidden : classes.isDisplayed}
          classes={{ primary: classes.itemPrimary }}
        >
          {titlec}
        </ListItemText>
      </div>
    );
    if (linkc) {
      linkContent = <Link href={hrefc}>{linkContent}</Link>;
    }
    return linkContent;
  };

  /**
   * Renders children of a given category
   * @param {string} idname
   * @param {Object[]} children
   * @param {number} depth - Shows how deep we are in the navigatorItemsTree
   * @returns {ReactElement} children
   */
  const renderChildren = (idname, children, depth) => {
    if (idname != "Lifecycle" && children && children.length > 0) {
      return (
        <List disablePadding>
          {children.map(
            ({ id: idc, title: titlec, icon: iconc, href: hrefc, show: showc, link: linkc, children: childrenc }) => {
              if (typeof showc !== "undefined" && !showc) {
                return "";
              }
              return (
                <React.Fragment key={idc}>
                  <ListItem
                    button
                    key={idc}
                    className={classNames(
                      depth === 1 ? classes.nested1 : classes.nested2,
                      classes.item,
                      classes.itemActionable,
                      getPath() === hrefc && classes.itemActiveItem,
                      isDrawerCollapsed && classes.noPadding
                    )}
                  >
                    {linkContent(iconc, titlec, hrefc, linkc, isDrawerCollapsed)}
                  </ListItem>
                  {renderChildren(idname, childrenc, depth + 1)}
                </React.Fragment>
              );
            }
          )}
        </List>
      );
    }
    if (idname == "Lifecycle") {
      if (children && children.length > 1) {
        return (
          <List disablePadding>
            {children.map(
              ({ id: idc, title: titlec, icon: iconc, href: hrefc, show: showc, link: linkc, children: childrenc }) => {
                if (typeof showc !== "undefined" && !showc) {
                  return "";
                }
                return (
                  <React.Fragment key={idc}>
                    <ListItem
                      button
                      key={idc}
                      className={classNames(
                        depth === 1 ? classes.nested1 : classes.nested2,
                        classes.item,
                        classes.itemActionable,
                        getPath() === hrefc && classes.itemActiveItem,
                        isDrawerCollapsed && classes.noPadding
                      )}
                      //   onClick={() => this.handleAdapterClick(idc, linkc)}
                    >
                      {linkContent(iconc, titlec, hrefc, linkc, isDrawerCollapsed)}
                    </ListItem>
                    {renderChildren(idname, childrenc, depth + 1)}
                  </React.Fragment>
                );
              }
            )}
          </List>
        );
      }
      if (children && children.length == 1) {
        // .updateAdaptersLink();
      }
    }
    return "";
  };

  const renderNavItems = (items) => {
    return items.map(({ id: childId, title, icon, href, show, link, children }) => {
      if (show)
        return (
          <React.Fragment key={childId}>
            <ListItem
              button={!!link}
              dense
              key={childId}
              className={classNames(
                classes.item,
                link ? classes.itemActionable : "",
                getPath() === href && classes.itemActiveItem
              )}
              onClick={() => toggleItemCollapse(childId)}
              onMouseOver={() => (children && isDrawerCollapsed ? setHoveredId(childId) : null)}
              onMouseLeave={() => (!openItems.includes(childId) ? setHoveredId(null) : null)}
            >
              <Link href={link ? href : ""}>
                <div className={classNames(classes.link)}>
                  <Tooltip
                    title={childId}
                    placement="right"
                    disableFocusListener={!isDrawerCollapsed}
                    disableHoverListener={!isDrawerCollapsed}
                    disableTouchListener={!isDrawerCollapsed}
                  >
                    {isDrawerCollapsed && children && (hoveredId === childId || openItems.includes(childId)) ? (
                      <ExpandMoreIcon
                        onClick={() => toggleItemCollapse(childId)}
                        className={classNames({ [classes.collapsed]: openItems.includes(childId) })}
                      />
                    ) : (
                      <ListItemIcon className={classes.listIcon}>{icon}</ListItemIcon>
                    )}
                  </Tooltip>
                  <ListItemText
                    className={isDrawerCollapsed ? classes.isHidden : classes.isDisplayed}
                    classes={{ primary: classes.itemPrimary }}
                  >
                    {title}
                  </ListItemText>
                </div>
              </Link>
              <ExpandMoreIcon
                onClick={() => toggleItemCollapse(childId)}
                className={classNames(classes.expandMoreIcon, {
                  [classes.collapsed]: openItems.includes(childId),
                })}
                style={isDrawerCollapsed || !children ? { opacity: 0 } : {}}
              />
            </ListItem>
            <Collapse in={openItems.includes(childId)} style={{ backgroundColor: "#396679", opacity: "100%" }}>
              {renderChildren(childId, children, 1)}
            </Collapse>
          </React.Fragment>
        );
      return null;
    });
  };

  //---------------------------------  ExtensionsNavigatorHelpers  -----------------------------------

  /**
   * @param {import("@/utils/extensionPointSchemaValidator").NavigatorSchema[]} children
   * @param {number} depth
   */
  const renderNavigatorExtensions = (children, depth) => {
    if (children && children.length > 0) {
      return (
        <List disablePadding>
          {children?.map(({ id, icon, href, title, children }) => {
            return (
              <React.Fragment key={id}>
                <ListItem
                  button
                  key={id}
                  className={classNames(
                    depth === 1 ? classes.nested1 : classes.nested2,
                    classes.item,
                    classes.itemActionable,
                    getPath() === href && classes.itemActiveItem,
                    isDrawerCollapsed && classes.noPadding
                  )}
                >
                  {extensionPointContent(icon, href, title, isDrawerCollapsed)}
                </ListItem>
                {renderNavigatorExtensions(children, depth + 1)}
              </React.Fragment>
            );
          })}
        </List>
      );
    }
  };

  const extensionPointContent = (icon, href, name, drawerCollapsed) => {
    const content = (
      <div className={classNames(classes.link)}>
        <Tooltip
          title={name}
          placement="right"
          disableFocusListener={!drawerCollapsed}
          disableHoverListener={!drawerCollapsed}
          disableTouchListener={!drawerCollapsed}
        >
          <ListItemIcon className={classes.listIcon}>
            <img src={icon} className={classes.icon} />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          className={drawerCollapsed ? classes.isHidden : classes.isDisplayed}
          classes={{ primary: classes.itemPrimary }}
        >
          {name}
        </ListItemText>
      </div>
    );

    if (href) return <Link href={href}>{content}</Link>;

    return content;
  };

  //----------------------------******----------------------------------------------------

  const renderExternalLinkItems = () => {
    return (
      <div className={classes.fixedSidebarFooter}>
        <ButtonGroup
          size="large"
          className={!isDrawerCollapsed ? classes.marginLeft : classes.btnGrpMarginRight}
          orientation={isDrawerCollapsed ? "vertical" : "horizontal"}
        >
          {externlinks.map(({ id, icon, title, href }, index) => {
            return (
              <ListItem
                key={id}
                className={classes.item}
                style={isDrawerCollapsed && !showHelperButton ? { display: "none" } : {}}
              >
                <Grow in={showHelperButton} timeout={{ enter: 600 - index * 200, exit: 100 * index }}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={classNames(classes.link, isDrawerCollapsed ? classes.extraPadding : "")}
                  >
                    <Tooltip title={title} placement={isDrawerCollapsed ? "right" : "top"}>
                      <ListItemIcon className={classNames(classes.listIcon, classes.helpIcon)}>{icon}</ListItemIcon>
                    </Tooltip>
                  </a>
                </Grow>
              </ListItem>
            );
          })}
          <ListItem className={classes.rightMargin}>
            <Tooltip title="Help" placement={isDrawerCollapsed ? "right" : "top"}>
              <IconButton
                className={isDrawerCollapsed ? classes.collapsedHelpButton : classes.rightTranslate}
                onClick={toggleSpacing}
              >
                <HelpIcon className={classes.helpIcon} style={{ fontSize: "1.45rem" }} />
              </IconButton>
            </Tooltip>
          </ListItem>
        </ButtonGroup>

        <ListItem
          button
          className={classname}
          onClick={() => toggleMiniDrawer()}
          style={{
            position: "sticky",
            zIndex: "1",
            bottom: "0",
            right: "0",
          }}
        >
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            fixedWidth
            color="#eeeeee"
            size="lg"
            alt="Sidebar collapse toggle icon"
          />
        </ListItem>
      </div>
    );
  };
  return (
    <nav className={isDrawerCollapsed ? classes.drawerCollapsed : classes.drawer}>
      <Drawer
        variant="permanent"
        className={isDrawerCollapsed ? classes.sidebarCollapsed : classes.sidebarExpanded}
        classes={{ paper: isDrawerCollapsed ? classes.sidebarCollapsed : classes.sidebarExpanded }}
        style={{ width: "inherit" }}
      >
        <List disablePadding>
          <ListItem
            component="a"
            onClick={handleTitleClick}
            className={classNames(classes.firebase, classes.item, classes.itemCategory, classes.cursorPointer)}
          >
            <Avatar
              className={isDrawerCollapsed ? classes.mainLogoCollapsed : classes.mainLogo}
              src="/static/img/meshery-logo.png"
            />
            <Avatar
              className={isDrawerCollapsed ? classes.mainLogoTextCollapsed : classes.mainLogoText}
              src="/static/img/meshery-logo-text.png"
            />
          </ListItem>
          {renderNavItems(categories)}
          {extensionsNavigator && extensionsNavigator.length ? (
            <React.Fragment>
              <Divider className={classes.divider} />
              {renderNavigatorExtensions(extensionsNavigator, 1)}
            </React.Fragment>
          ) : null}
          <Divider className={classes.divider} />
        </List>
        {renderExternalLinkItems()}
      </Drawer>
    </nav>
  );
};

export default Navbar;