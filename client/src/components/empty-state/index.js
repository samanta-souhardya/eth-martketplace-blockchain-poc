const EmptyState = (props) => {
  return (
    <div className="empty">
      <div className="empty-icon">
        <i className={`icon icon-3x ${props.icon}`}></i>
      </div>
      <p className="empty-title h5">{props.title}</p>
      <p className="empty-subtitle">{props.description}</p>
      <div className="empty-action">{props.children}</div>
    </div>
  );
};

export default EmptyState;
