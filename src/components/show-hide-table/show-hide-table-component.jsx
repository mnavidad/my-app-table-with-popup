const ShowHideTable = () =>{
    return (

        <div id="mainDiv" className="esri-widget esri-component">
        <label className="switch">
          <input id="checkboxId" type="checkbox" defaultChecked />
          <span className="slider round"></span>
        </label>
        <label className="labelText" id="labelText">Hide feature table</label>
      </div>

    );
}
export default ShowHideTable;