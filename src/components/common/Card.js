import React from 'react';
import PropTypes from 'prop-types';
import './Card.css'; // You'll need to create this CSS file

/**
 * Card component for dashboard items
 */
const Card = ({ 
    title, 
    children, 
    className, 
    footer, 
    headerAction, 
    loading 
}) => {
    return (
        <div className={`card ${className || ''} ${loading ? 'card-loading' : ''}`}>
            {title && (
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    {headerAction && <div className="card-header-action">{headerAction}</div>}
                </div>
            )}
            <div className="card-body">
                {loading ? <div className="card-loading-indicator">Loading...</div> : children}
            </div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

Card.propTypes = {
    /** Card title displayed in the header */
    title: PropTypes.string,
    /** Card content */
    children: PropTypes.node.isRequired,
    /** Additional CSS class names */
    className: PropTypes.string,
    /** Footer content */
    footer: PropTypes.node,
    /** Action element to display in the header (buttons, etc.) */
    headerAction: PropTypes.node,
    /** Whether the card is in loading state */
    loading: PropTypes.bool
};

Card.defaultProps = {
    loading: false
};

export default Card;