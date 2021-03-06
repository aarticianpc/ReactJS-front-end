import React, { Component, FormEvent } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { connect } from 'react-redux';
import { IAppState } from 'store';
import { bookAcService, updateLocationAcService } from 'action/acService';
import PropTypes from 'prop-types';

export interface IACServiceState{
    s_no: number;
    user_id: number;
    serviceType: string;
    iabTypeProblem:string[];
    iabTypeNoACUnits: string;
    iabTypeBrand: string[];
    buildingType: string;
    startTime: string;
    startDate: Date;
    location: any;
    bookingAreas: any[];
    additionalAdd: string;
    serviceTypeError: boolean;
    iabTypeProblemError:boolean;
    iabTypeNoACUnitsError: boolean;
    iabTypeBrandError: boolean;
    buildingTypeError: boolean;
    startTimeError: boolean;
    locationError: boolean;
    additionalAddError: boolean;
    //[key: string]: any    
}

class BookingDetails extends React.Component<any,IACServiceState> {
    state={
        s_no: this.props.acBookings.Bookings.length,
        user_id:5,//+this.props.location.pathname.split("/").slice(-1)[0],
        serviceType: "",
        iabTypeProblem:[] as string[],
        iabTypeNoACUnits: "1",
        iabTypeBrand: [] as string[],
        buildingType: "",
        startTime: "14:00",
        startDate: new Date(),
        location: {},
        additionalAdd: "",
        bookingAreas: [],
        serviceTypeError: false,
        iabTypeProblemError:false,
        iabTypeNoACUnitsError: false,
        iabTypeBrandError: false,
        buildingTypeError: false,
        startTimeError: false,
        locationError: false,
        additionalAddError: false,
    }


    changeHandler = (e:any) => {
        if(!(e.target.name === "iabTypeNoACUnits" && (e.target.value != "" && +e.target.value <=0))){
            this.setState({[e.target.name]: e.target.value} as any);
        }
    }

    handleDate = (e:any) =>{
        this.setState({startDate: e});
    }

    checkBoxHandler = (e:any,key:keyof IACServiceState) =>{
        let newarray = this.state[key] as string[];
        if(!e.target.checked){
            newarray.splice(newarray.indexOf(e.target.value),1);
            this.setState({[key]: newarray} as any); 
        }
        else{
            newarray.push(e.target.value);
            this.setState({[key]: newarray} as any);
        }
    }

    componentDidMount(){
        const editAcServiceDetailSNo = +this.props.location.pathname.split("/").slice(-1)[0];
        if(!isNaN(editAcServiceDetailSNo)){
            let bookings = this.props.acBookings.Bookings.filter((booking:IACServiceState)=> {
                if(booking.s_no === editAcServiceDetailSNo){
                    return true;
                }
                return false;
            });

            this.setState({
                ...this.state,
                ...bookings[0]
            });
        }
        this.setState({
            user_id: this.props.Users.Users[0].u_id
        });
    }

    submit = async()=>{
        const editAcServiceDetailSNo = +this.props.location.pathname.split("/").slice(-1)[0];
        if(this.state.serviceType === ""){
            await this.setState({serviceTypeError: true});
        }
        else{
            await this.setState({serviceTypeError: false});
        }
        if(this.state.iabTypeProblem.length <= 0){
            await this.setState({iabTypeProblemError: true});
        }else{
            await this.setState({iabTypeProblemError: false});
        }
        if(+this.state.iabTypeNoACUnits <= 0){
            await this.setState({iabTypeNoACUnitsError: true});
        }else{
            await this.setState({iabTypeNoACUnitsError: false});
        }
        if(this.state.iabTypeBrand.length <= 0){
            await this.setState({iabTypeBrandError: true});
        }else{
            await this.setState({iabTypeBrandError: false});
        }
        if(this.state.buildingType === ""){
            await this.setState({buildingTypeError: true});
        }else{
            await this.setState({buildingTypeError: false});
        }
        if(this.state.startTime === ""){
            await this.setState({startTimeError: true});
        }else{
            await this.setState({startTimeError: false});
        }
        if(!this.state.buildingTypeError && !this.state.iabTypeBrandError && !this.state.iabTypeNoACUnitsError && !this.state.iabTypeProblemError && !this.state.serviceTypeError && !this.state.startTimeError){
            if(isNaN(editAcServiceDetailSNo)){
                this.props.bookAcService(this.state);
            }else{
                for (let index in this.props.acBookings.Bookings){
                    if(this.props.acBookings.Bookings[index].s_no === this.state.s_no){
                        this.props.acBookings.Bookings[index] = this.state;
                        break;
                    }
                };
                this.props.updateLocationAcService(this.props.acBookings.Bookings);
            }
            this.props.history.push("/acservice/location/"+this.state.s_no);
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <Card.Header>
                        <h3>AC Service</h3>
                    </Card.Header>
                    <Card.Body>
                        <Card>
                        <Card.Header className="text-primary">
                            <h3>Service Type</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form.Check 
                                checked = {this.state.serviceType === "AC Cleaning" }
                                type={"radio"}
                                id={`acCleaningRadio`}
                                name={'serviceType'}
                                label={`AC Cleaning`}
                                value = {`AC Cleaning`}
                                onChange={this.changeHandler}>
                            </Form.Check>
                            <Form.Check 
                                checked = {this.state.serviceType === "AC Installation" }
                                type={"radio"}
                                name={'serviceType'}
                                id={`acInstallationRadio`}
                                label={`AC Installation`}
                                value={`AC Installation`}
                                onChange={this.changeHandler}>
                            </Form.Check>
                            <Form.Check 
                                checked = {this.state.serviceType === "AC Repairing" }
                                type={"radio"}
                                name={'serviceType'}
                                id={`acRepairRadio`}
                                label={`AC Repairing`}
                                value={`AC Repairing`}
                                onChange={this.changeHandler}>
                            </Form.Check>
                            {
                                this.state.serviceTypeError && 
                                <Form.Control.Feedback style={{display:"block"}} type="invalid">
                                    Please choose atleast one.
                                </Form.Control.Feedback>
                            }
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="text-primary">
                            <h3>Information and Building Type</h3>
                        </Card.Header>
                        <Card.Body>
                        <Form.Group>
                            <Form.Label><h5>Tell Us Your Problem</h5></Form.Label>
                            <Form.Check 
                                checked = {this.state.iabTypeProblem.indexOf("AC is not cold") >=0 }
                                type={"checkbox"}
                                id={`problemCheckbox1`}
                                name={'iabTypeProblem'}
                                label={`AC is not cold`}
                                value={`AC is not cold`}
                                onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeProblem")}>
                            </Form.Check>
                            <Form.Check
                                checked = {this.state.iabTypeProblem.indexOf("AC Smells foul") >=0 } 
                                type={"checkbox"}
                                name={'iabTypeProblem'}
                                id={`problemCheckbox2`}
                                label={`AC Smells foul`}
                                value={`AC Smells foul`}
                                onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeProblem")}>
                            </Form.Check>
                            <Form.Check 
                                checked = {this.state.iabTypeProblem.indexOf("Others") >=0 }
                                type={"checkbox"}
                                name={'iabTypeProblem'}
                                id={`problemCheckbox3`}
                                label={`Others`}
                                value={`Others`}
                                onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeProblem")}>
                            </Form.Check>
                            {
                                this.state.iabTypeProblemError && 
                                <Form.Control.Feedback style={{display:"block"}} type="invalid">
                                    Please choose atleast one.
                                </Form.Control.Feedback>
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><h5>No. Of AC Units</h5></Form.Label>
                            <Form.Control
                                type="text"
                                name="iabTypeNoACUnits"
                                value={this.state.iabTypeNoACUnits}
                                onChange={this.changeHandler}
                            />
                            {
                                this.state.iabTypeNoACUnitsError && 
                                <Form.Control.Feedback style={{display:"block"}} type="invalid">
                                    Please write no. of ac units.
                                </Form.Control.Feedback>
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><h5>Your AC Brand</h5></Form.Label>
                            <div>
                                <Row>
                                    <Col lg="2">
                                        <Form.Check 
                                            inline 
                                            checked = {this.state.iabTypeBrand.indexOf("LG") >=0 }
                                            type={"checkbox"}
                                            id={`brandCheckbox1`}
                                            name={'iabTypeBrand'}
                                            label={`LG`}
                                            value={`LG`}
                                            onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeBrand")}>
                                        </Form.Check>
                                    </Col>
                                    <Col>
                                        <Form.Check 
                                            inline 
                                            checked = {this.state.iabTypeBrand.indexOf("Panasonic") >=0 }
                                            type={"checkbox"}
                                            name={'iabTypeBrand'}
                                            id={`brandCheckbox2`}
                                            label={`Panasonic`}
                                            value={`Panasonic`}
                                            onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeBrand")}>
                                        </Form.Check>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col lg="2">
                                        <Form.Check 
                                            inline 
                                            checked = {this.state.iabTypeBrand.indexOf("Samsung") >=0 }
                                            type={"checkbox"}
                                            name={'iabTypeBrand'}
                                            id={`brandCheckbox3`}
                                            label={`Samsung`}
                                            value={`Samsung`}
                                            onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeBrand")}>
                                        </Form.Check>
                                    </Col>
                                    <Col>
                                        <Form.Check 
                                            inline 
                                            checked = {this.state.iabTypeBrand.indexOf("Sharp") >=0 }
                                            type={"checkbox"}
                                            id={`brandCheckbox4`}
                                            name={'iabTypeBrand'}
                                            label={`Sharp`}
                                            value={`Sharp`}
                                            onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeBrand")}>
                                        </Form.Check>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col lg="2">
                                        <Form.Check 
                                            inline 
                                            checked = {this.state.iabTypeBrand.indexOf("Daikin") >=0 }
                                            type={"checkbox"}
                                            name={'iabTypeBrand'}
                                            id={`brandCheckbox5`}
                                            label={`Daikin`}
                                            value={`Daikin`}
                                            onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeBrand")}>
                                        </Form.Check>
                                    </Col>
                                    <Col>
                                        <Form.Check 
                                            inline 
                                            checked = {this.state.iabTypeBrand.indexOf("Others") >=0 }
                                            type={"checkbox"}
                                            name={'iabTypeBrand'}
                                            id={`brandCheckbox6`}
                                            label={`Others`}
                                            value={`Others`}
                                            onChange={(e:any)=>this.checkBoxHandler(e,"iabTypeBrand")}>
                                        </Form.Check>
                                    </Col>
                                </Row>    
                            </div>
                            {
                                this.state.iabTypeBrandError && 
                                <Form.Control.Feedback style={{display:"block"}} type="invalid">
                                    Please choose atleast one.
                                </Form.Control.Feedback>
                            }
                        </Form.Group>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="text-primary">
                            <h3>Your Building Type</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col lg="2">
                                    <Form.Check 
                                        checked = {this.state.buildingType === "House" }
                                        type={"radio"}
                                        id={`houseRadio`}
                                        name={'buildingType'}
                                        label={`House`}
                                        value={`House`}
                                        onChange= {this.changeHandler}>
                                    </Form.Check>
                                </Col>
                                <Col>
                                    <Form.Check 
                                        checked = {this.state.buildingType === "Apartment (+Rp. 25,000)" }
                                        type={"radio"}
                                        id={`appartmentRadio`}
                                        name={'buildingType'}
                                        label={`Apartment (+Rp. 25,000)`}
                                        value={`Apartment (+Rp. 25,000)`}
                                        onChange= {this.changeHandler}>
                                    </Form.Check>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="2">
                                    <Form.Check 
                                        checked = {this.state.buildingType === "Home Office (+Rp. 25,000)" }
                                        type={"radio"}
                                        id={`homeOfficeRadio`}
                                        name={'buildingType'}
                                        label={`Home Office (+Rp. 25,000)`}
                                        value={`Home Office (+Rp. 25,000)`}
                                        onChange= {this.changeHandler}>
                                    </Form.Check>
                                </Col>
                                <Col>
                                    <Form.Check 
                                        checked = {this.state.buildingType === "Office Building (+Rp. 25,000)" }
                                        type={"radio"}
                                        id={`officeBuildingRadio`}
                                        name={'buildingType'}
                                        label={`Office Building (+Rp. 25,000)`}
                                        value={`Office Building (+Rp. 25,000)`}
                                        onChange= {this.changeHandler}>
                                    </Form.Check>
                                </Col>
                            </Row>
                            {
                                this.state.buildingTypeError && 
                                <Form.Control.Feedback style={{display:"block"}} type="invalid">
                                    Please choose atleast one.
                                </Form.Control.Feedback>
                            }
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="text-primary">
                            <h3>When Do You Need Our Service?</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Row>
                                    <Col sm={1}>
                                        <Form.Label>Date -</Form.Label>
                                    </Col>
                                    <Col sm={1}>
                                        <DatePicker
                                            customInput={<ExampleCustomInput onClick={this.handleDate} value={this.state.startDate}/>}
                                            selected={this.state.startDate}
                                            onChange={this.handleDate}
                                            name="startDate"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col sm={1}>
                                        <Form.Label>Time</Form.Label>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Control as="select"
                                            name="startTime"
                                            onChange = {this.changeHandler}
                                            value={this.state.startTime}>
                                            <option  value="">---Select---</option>
                                            <option >8:00</option>
                                            <option >9:00</option>
                                            <option >10:00</option>
                                            <option >11:00</option>
                                            <option >12:00</option>
                                            <option >13:00</option>
                                            <option >14:00</option>
                                            <option >15:00</option>
                                            <option >16:00</option>
                                            <option >17:00</option>
                                            <option >18:00</option>
                                            <option >19:00</option>
                                        </Form.Control>
                                    </Col>
                                </Row>
                                {
                                    this.state.startTimeError && 
                                    <Form.Control.Feedback style={{display:"block"}} type="invalid">
                                        Please choose atleast one time.
                                    </Form.Control.Feedback>
                                }
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Row>
                        <Col lg="2">
                            <Form.Label>Price</Form.Label>
                        </Col>
                        <Col lg="2">
                            <Form.Label >60.00</Form.Label>
                        </Col>
                    </Row>
                    <Button 
                        variant="primary"
                        size="lg"
                        onClick={this.submit}>Next</Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = (state:IAppState)=>({
        acBookings: state.serviceState,
        Users: state.authState
});

export default connect(mapStateToProps,{bookAcService, updateLocationAcService})(BookingDetails);

interface IExampleCustomInputProps{
    onClick: any,
    value: any
}

class ExampleCustomInput extends React.Component<IExampleCustomInputProps> {

    render () {
      return (
        <button
          className="btn btn-primary example-custom-input"
          onClick={this.props.onClick}>
          {this.props.value}
        </button>
      )
    }
  }
  
 
  