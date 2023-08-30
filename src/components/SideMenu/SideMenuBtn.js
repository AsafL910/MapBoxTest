const SideMenuBtn = ({Icon, onClick, className}) => {
  return (
    <div className={`icon-frame ${className}`} onClick={onClick}>
        <Icon fontSize="large" alt="f"/>
    </div>
  )
}

export default SideMenuBtn