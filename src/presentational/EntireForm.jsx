import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import planet from './../planet.png';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';

class EntireForm extends React.Component {
    constructor(props) {
        super(props);
        let b = new Date();
        let dateFormat = `${b.getDate()}/${b.getMonth()>8?"":0}${b.getMonth()+1}/${b.getFullYear()}`;
        this.state = {
            date1: dateFormat,
            date2: dateFormat,
            date3: dateFormat,
            date4: dateFormat,
            date5: dateFormat,
            quote1: "",
            quote2: "",
            quote3: "",
            quote4: "",
            quote5: "",
            total: "",
            savings: "",
            anual: "25 años",
            invest_return: "",
            client: "",
            service: "",
            power: "",
            panels: "",
            panel_power: "",
            panel_desc: "",
            total_big: "",
            anual_pay_solar: "",
            anual_pay_actual: "",
            savings_chart: "",
            savings_proportion: "",
            invest_return_big: "",
            subtotal_usd: "",
            iva_usd: "",
            total_usd: "",
            total_mxn: "",
            currency_rate: "",
            usd_rate: 0,
            quantity1: "",
            description1: "",
            quantity2: "",
            description2: "",
            quantity3: "",
            description3: "",
            quantity4: "",
            description4: "",
            quantity5: "",
            description5: "",
            quantity6: "",
            description6: "",
            quantity7: "",
            description7: "",
            panel_quantity: "",
            products: [
                {
                    month: 'Enero',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Febrero',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Marzo',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Abril',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Mayo',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Junio',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Julio',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Agosto',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Septiembre',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Octubre',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Noviembre',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Diciembre',
                    hours: '',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                }
            ]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getRates().then(result =>{
            this.setState({currency_rate: result.data.rates.MXN.toFixed(2)})
        });
    }

    getRates() {
        return axios.get("https://api.exchangeratesapi.io/latest?symbols=MXN&base=USD");
    }

    format_output(dict) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        console.log(dict["total_usd"]);
        let usd_value = parseFloat(dict["total_usd"]);
        let currency_factor = dict["usd_rate"] == 0 ? parseFloat(dict["currency_rate"]) : parseFloat(dict["usd_rate"]);
        dict["subtotal_usd"] = formatter.format(usd_value / 1.16);
        dict["iva_usd"] = formatter.format(usd_value*0.16);
        dict["total_mxn"] = formatter.format(usd_value*currency_factor);
        dict["total_big"] = dict["total_mxn"];
        dict["total"] = dict["total_mxn"];
        dict["total_usd"] = formatter.format(dict["total_usd"]);
        dict["panel_quantity"] = parseInt(dict["panels"]).toFixed(2);
        dict["panel_desc"] = `${dict["panel_desc"]} ${dict["panel_power"]} watts`;
        dict["power"] = `${(parseInt(dict["panel_power"]) * parseInt(dict["panels"]) / 1000).toFixed(2)} KWp`
        dict["panel_power"] = `De ${dict["panel_power"]} Wp`;
        dict["panels"] = `${dict["panels"]} paneles`;
        for (let i = 1; i <= 7; i++) {
            if (dict[`quantity${i}`]) {
                dict[`quantity${i}`] = parseInt(dict[`quantity${i}`]).toFixed(2);
            }
        }
        console.log(dict);
    }

    handleSubmit() {
        let to_send = this.state;
        this.format_output(to_send);
        axios.post(`http://127.0.0.1:5000/generate`, to_send, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow_Origin': '*',
                'Content-Disposition': 'attachment; filename="cotizacion.pdf"',
                'Content-Transfer-Encoding': 'binary'
            },
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cotizacion.pdf');
            document.body.appendChild(link);
            link.click();
        })
    };

    handleChange(e) {
        if (e.target.id == 'quote' ) {
            for (let i = 1; i <= 5; i++) {
                this.setState({[`${e.target.id}${i}`]: `No. de cotización: ${e.target.value}`});
            }
        } else {
            this.setState({[e.target.id]: e.target.value});
        }
    }

    render() {
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: () => {console.log(this.state);}
        };
        return (
            <div className="container">
                <div style={{height: "10vh"}}>

                </div>
                <div className="row">
                    <div className="col-md-8 order-md-2 mb-4">
                    <BootstrapTable data={ this.state.products } tableHeaderClass={"thead-dark"} cellEdit={cellEditProp}>
                        <TableHeaderColumn dataField='month' isKey>Mes</TableHeaderColumn>
                        <TableHeaderColumn dataField='hours'>Horas de irradiación</TableHeaderColumn>
                        <TableHeaderColumn dataField='consume'>Consumo</TableHeaderColumn>
                        <TableHeaderColumn dataField='production'>Producción</TableHeaderColumn>
                        <TableHeaderColumn dataField='pay_before'>Pago antes</TableHeaderColumn>
                        <TableHeaderColumn dataField='pay_after'>Pago con energía solar</TableHeaderColumn>
                    </BootstrapTable>
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Total</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div className="col-md-4 order-md-1">
                        <div className="row">
                            <div className="col-6 offset-3">
                                <img src={planet} height="120" width="120" style={{marginBottom:"2vh"}} />
                            </div>
                        </div>

                        <h4 className="mb-3">Arma tu proyecto</h4>

                        <label htmlFor="client">Cliente</label>
                        <InputGroup className="mb-3">
                            <FormControl onChange={this.handleChange} id="client" />
                        </InputGroup>

                        <label htmlFor="direccion">Direccion</label>
                        <InputGroup className="mb-3">
                            <FormControl id="direccion" />
                        </InputGroup>

                        <label htmlFor="city">Ciudad</label>
                        <InputGroup className="mb-3">
                            <FormControl id="city"/>
                        </InputGroup>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="service"># Servicio</label>
                                <InputGroup className="mb-3">
                                    <FormControl onChange={this.handleChange} id="service" />
                                </InputGroup>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="quote"># Cotizacion</label>
                                <InputGroup className="mb-3">
                                    <FormControl onChange={this.handleChange} maxLength="4" id="quote" />
                                </InputGroup>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-12 mb-3">
                                <label for="tarifa">Tipo de tarifa</label>
                                <select id="tarifa" className="browser-default custom-select">
                                    <option selected>1</option>
                                    <option value="1">1A</option>
                                    <option value="2">1B</option>
                                    <option value="3">1C</option>
                                    <option value="1">1D</option>
                                    <option value="2">1E</option>
                                    <option value="3">1F</option>
                                    <option value="3">PDBT</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="sistema-solar">Sistema solar</label>
                                <InputGroup className="mb-3">
                                    <FormControl id="sistema-solar" />
                                </InputGroup>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="eficiencia">Eficienca</label>
                                <InputGroup className="mb-3">
                                    <FormControl id="eficiencia" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="mb-4" />

                <div className="row">
                    <div className="col-2 offset-2">
                        Cantidad
                    </div>
                    <div className="col-8">
                        Descripción
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-2">
                        <label for="inversor">Paneles</label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="panels" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-6">
                        <FormControl onChange={this.handleChange} id="panel_desc" type="text"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="panel_power" type="number" placeholder="Wp"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity1" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description1" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity2" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description2" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity3" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description3" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity4" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description4" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity5" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description5" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity6" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description6" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label for="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity7" type="number" step="any"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description7" type="text"/>
                    </InputGroup>
                </div>
                <br />
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="total_usd">Costo en dolares:</label>
                    </div>
                    <InputGroup className="mb-3 col-4">
                        <FormControl onChange={this.handleChange} id="total_usd" step="any" placeholder="USD" type="number"/>
                    </InputGroup>
                    <div className="col-2">
                        <label htmlFor="usd_rate">Tasa de cambio:</label>
                    </div>
                    <InputGroup className="mb-3 col-4">
                        <FormControl id="usd_rate" step="any" onChange={this.handleChange} type="number" defaultValue={this.state.currency_rate}/>
                    </InputGroup>
                </div>
                <br />
                <div className="row">
                    <div className="col-3 offset-9">
                        <Button onClick={this.handleSubmit} variant="primary" id="submit" style={{width: "100%"}}>Enviar</Button>
                    </div>
                </div>

                <footer className="my-5 pt-5 text-muted text-center text-small">
                    <p className="mb-1">&copy; 2020-2022 Centro de Inteligencia en Ahorro de Energía</p>
                    <ul className="list-inline">
                        <li className="list-inline-item"><a href="#">Privacy</a></li>
                        <li className="list-inline-item"><a href="#">Terms</a></li>
                        <li className="list-inline-item"><a href="#">Support</a></li>
                    </ul>
                </footer>
            </div>
        );
    }
}

export default EntireForm;