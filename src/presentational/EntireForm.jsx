import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import planet from './../planet.png';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import { months_temp, pay_before_temp_costs_domestic_1 } from './variablesDomestic';
import { sun } from './horasSol';

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
            adress: "",
            anual: "25 años",
            sistema_solar: 0,
            eficiencia: 0,
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
            saved_co2: 0,
            saved_trees: 0,
            total_usd: "",
            total_mxn: "",
            currency_rate: "",
            usd_rate: 0,
            savings_proportion_small: "",
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
            city: "hermosillo",
            table: [
                {
                    month: 'Enero',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Febrero',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Marzo',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Abril',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Mayo',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Junio',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Julio',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Agosto',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Septiembre',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Octubre',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Noviembre',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                },{
                    month: 'Diciembre',
                    consume: '',
                    production: '',
                    pay_before: '',
                    pay_after: ''
                }
            ],
            totals: ["0.00", "0.00", "0.00", "0.00", "0.00"],
            tarifa: "1"
        }
        this.pay_before_temps = pay_before_temp_costs_domestic_1;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
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
        let savings = parseFloat(this.state.totals[3]) - parseFloat(this.state.totals[4]);
        let usd_value = parseFloat(dict["total_usd"]);
        let currency_factor = dict["usd_rate"] === 0 ? parseFloat(dict["currency_rate"]) : parseFloat(dict["usd_rate"]);
        let watts = parseInt(dict["panel_power"]) * parseInt(dict["panels"]) / 1000;
        dict["subtotal_usd"] = formatter.format(usd_value / 1.16);
        dict["iva_usd"] = formatter.format(usd_value*0.16);
        dict["total_mxn"] = formatter.format(usd_value*currency_factor);
        dict["total_big"] = dict["total_mxn"];
        dict["total"] = dict["total_mxn"];
        dict["total_usd"] = formatter.format(dict["total_usd"]);
        dict["panel_quantity"] = dict["panels"];
        dict["panel_desc"] = `${dict["panel_desc"]} ${dict["panel_power"]} watts`;
        dict["power"] = `${(watts).toFixed(2)} KWp`
        dict["panel_power"] = `De ${dict["panel_power"]} Wp`;
        dict["panels"] = `${dict["panels"]} paneles`;
        dict["saved_co2"] = (watts*0.78).toFixed(3);
        dict["saved_trees"] = formatter.format(watts*11.7).slice(1,-3);
        dict["savings"] = formatter.format(savings);
        dict["invest_return"] = `${(usd_value*currency_factor/savings).toFixed(1)} años`;
        dict["anual_pay_solar"] = formatter.format(parseFloat(this.state.totals[4]));
        dict["anual_pay_actual"] = formatter.format(parseFloat(this.state.totals[3]));
        dict["savings_chart"] = dict["savings"];
        dict["savings_proportion"] = `${Math.round((savings/parseFloat(this.state.totals[3]))*100)}%`;
        dict["savings_proportion_small"] = dict["savings_proportion"]
        dict["invest_return_big"] = dict["invest_return"];
        this.formatDictTable(dict["table"], formatter);
        this.formatDictTotals(dict["totals"], formatter);
    }

    formatDictTable(tabla, formatter) {
        tabla = tabla.map(element => {
            element.production = `${formatter.format(element.production).slice(1)}KWh`;
            element.consume = `${formatter.format(element.consume).slice(1)}KWh`;
            element.pay_before = `${formatter.format(element.pay_before)} MXN`;
            element.pay_after = `${formatter.format(element.pay_after)} MXN`;
        });
    }

    formatDictTotals(lista, formatter) {
        lista[1] = `${formatter.format(lista[1]).slice(1)}KWh`;
        lista[2] = `${formatter.format(lista[2]).slice(1)}KWh`;
        lista[3] = `${formatter.format(lista[3])} MXN`;
        lista[4] = `${formatter.format(lista[4])} MXN`;
    }

    handleSubmit() {
        let to_send = {...this.state};
        to_send.table = this.state.table.map(e => ({...e}));
        to_send.totals = [...this.state.totals];
        this.format_output(to_send);
        let url = "https://us-central1-cotizador-cia-energia.cloudfunctions.net/pdf-generate";
        axios.post( url, to_send, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow_Origin': '*',
                'Accept': 'application/json',
                'Content-Disposition': 'attachment; filename="cotizacion.pdf"',
                'Content-Transfer-Encoding': 'binary'
            },
            crossDomain: true,
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
        .catch(error => {
            console.log(error)
        })
    };

    handleChange(e) {
        if ( e.target.id === 'quote' ) {
            for (let i = 1; i <= 5; i++) {
                this.setState({[`${e.target.id}${i}`]: `No. de cotización: ${e.target.value}`});
            }
        } /*else if (e.target.id === 'eficiencia') {
            if(this.state.sistema_solar) {
                this.setState({[e.target.id]: parseFloat(e.target.value)}, () => {this.calculateProduction([...this.state.totals])});
            } else {
                this.setState({[e.target.id]: parseFloat(e.target.value)});
            };
        } else if (e.target.id === 'sistema_solar') {
            if(this.state.eficiencia) {
                this.setState({[e.target.id]: parseFloat(e.target.value)}, () => {this.calculateProduction([...this.state.totals])});
            } else {
                this.setState({[e.target.id]: parseFloat(e.target.value)});
            };
        } */else {
            this.setState({[e.target.id]: e.target.value});
        }
    }

    calculateProduction(new_totals) {
        let new_table = this.state.table.map(e => ({...e}));
        let new_value = 0;
        let checked = false;
        new_table.forEach(element => {
            new_value = Math.round(sun[this.state.city][element.month]*this.state.sistema_solar*this.state.eficiencia*31);
            element.production = new_value;
            if (element.pay_before) {
                checked = true;
                element.pay_after = this.calculatePayAfter(element, element.pay_before, new_value);
            }
        });
        if(checked) {
            new_totals[4] = this.calculateNewTotal("pay_after", new_table);
        };
        new_totals[2] = this.calculateNewTotal("production", new_table);
        this.setState({table: new_table, totals: new_totals});
    }

    calculatePayBefore(row, new_totals) {
        let consume = parseFloat(row.consume);
        let overhead = 0;
        let to_pay = 0;
        let tmp_row = {
            bajo: consume > this.pay_before_temps[months_temp.get(row.month)].cantidad_bajo? this.pay_before_temps[months_temp.get(row.month)].cantidad_bajo : 0,
            intermedio: 0,
            intermedio_alto: 0
        }
        if (months_temp.get(row.month) === 0) {
            tmp_row.intermedio = (consume - tmp_row.bajo > 125) ? this.pay_before_temps[0].cantidad_intermedio : 0;
            let bi = tmp_row.intermedio + tmp_row.bajo;
            overhead = consume > bi ? consume - bi : 0;
            to_pay = this.pay_before_temps[0].bajo*tmp_row.bajo + this.pay_before_temps[0].intermedio*tmp_row.intermedio + this.pay_before_temps[0].excedente*overhead;
        } else {
            tmp_row.intermedio = consume - tmp_row.bajo > 300 ? this.pay_before_temps[1].cantidad_intermedio : consume - tmp_row.bajo;
            tmp_row.intermedio_alto = Math.min(consume - tmp_row.bajo - tmp_row.intermedio, this.pay_before_temps[1].cantidad_intermedio_alto);
            let bii = tmp_row.intermedio + tmp_row.intermedio_alto + tmp_row.bajo;
            overhead = consume > bii ? consume - tmp_row.intermedio_alto : 0;
            to_pay = this.pay_before_temps[1].bajo*tmp_row.bajo + this.pay_before_temps[1].intermedio*tmp_row.intermedio + this.pay_before_temps[1].excedente*overhead + this.pay_before_temps[1].intermedio_alto*tmp_row.intermedio_alto;
        };
        let new_value = Math.round(to_pay);
        new_totals[3] = this.calculateNewTotal("pay_before", this.state.table, row.month, new_value);
        if (row.production) {
            let payAfter = this.calculatePayAfter(row, new_value, row.production);
            new_totals[4] = this.calculateNewTotal("pay_after", this.state.table, row.month, payAfter);
            this.setState(oldState => ({
                totals: new_totals,
                table: oldState.table.map(
                    el => el.month === row.month? { ...el, pay_before: new_value, pay_after: payAfter }: el
                )
            }));
        } else {
            this.setState(oldState => ({
                totals: new_totals,
                table: oldState.table.map(
                    el => el.month === row.month? { ...el, pay_before: new_value }: el
                )
            }));
        }
    }

    calculatePayAfter(row, pay_before, production) {
        let consume = parseFloat(production);
        let overhead = 0;
        let to_pay = 0;
        let tmp_row = {
            bajo: consume > this.pay_before_temps[months_temp.get(row.month)].cantidad_bajo? this.pay_before_temps[months_temp.get(row.month)].cantidad_bajo : 0,
            intermedio: 0,
            intermedio_alto: 0
        }
        if (months_temp.get(row.month) === 0) {
            tmp_row.intermedio = (consume - tmp_row.bajo > 125) ? this.pay_before_temps[0].cantidad_intermedio : consume - tmp_row.bajo;
            let bi = tmp_row.intermedio + tmp_row.bajo;
            overhead = consume > bi ? consume - bi : 0;
            to_pay = this.pay_before_temps[0].bajo*tmp_row.bajo + this.pay_before_temps[0].intermedio*tmp_row.intermedio + this.pay_before_temps[0].excedente*overhead;
        } else {
            tmp_row.intermedio = consume - tmp_row.bajo > 300 ? this.pay_before_temps[1].cantidad_intermedio : consume - tmp_row.bajo;
            tmp_row.intermedio_alto = Math.min(consume - tmp_row.bajo - tmp_row.intermedio, this.pay_before_temps[1].cantidad_intermedio_alto);
            let bii = tmp_row.intermedio + tmp_row.intermedio_alto + tmp_row.bajo;
            overhead = consume > bii ? consume - tmp_row.intermedio + tmp_row.bajo : 0;
            to_pay = this.pay_before_temps[1].bajo*tmp_row.bajo + this.pay_before_temps[1].intermedio*tmp_row.intermedio + this.pay_before_temps[1].excedente*overhead + this.pay_before_temps[1].intermedio_alto*tmp_row.intermedio_alto;
        };
        return pay_before - Math.round(to_pay);
    }

    calculateNewTotal(column, table, month, value) {
        month = month || "not_assigned";
        let total = 0;
        table.forEach(element => {
            if (element.month === month) {
                total += value;
            } else if (element[column]) {
                total += parseFloat(element[column]);
            }
        });
        return total;
    }

    forceUpdate(row, column) {
        let new_totals = this.state.totals;
        let total = this.calculateNewTotal(column, this.state.table);
        switch(column) {
            case 'consume':
                new_totals[1] = (total).toFixed(2);
                //this.calculatePayBefore(row, new_totals);
                break;
            case 'production':
                new_totals[2] = (total).toFixed(2);
                break;
            case 'pay_before':
                new_totals[3] = (total).toFixed(2);
                break;
            case 'pay_after':
                new_totals[4] = (total).toFixed(2);
                break;
        }
        this.setState({totals: new_totals})
    }

    handleChangeSelect(e) {
        let new_rate = e.target.value;
        this.setState(oldState => ({
            totals: oldState.totals.slice(0,3).concat(["0.00", "0.00"]),
            tarifa: new_rate,
            table: oldState.table.map(
                el => ({ ...el, pay_before: "", pay_after: "" })
            )
        }));
    }

    handleChangeCity(e) {
        /*if (this.state.sistema_solar && this.state.eficiencia) {
            this.setState({city: e.target.value}, () => {this.calculateProduction([...this.state.totals])});
        } else {
            this.setState({city: e.target.value});
        };*/
        this.setState({city: e.target.value});
    }

    render() {
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: (row, column) => {this.forceUpdate(row, column)}
        };
        return (
            <div className="container">
                <div style={{height: "10vh"}}>

                </div>
                <div className="row">
                    <div className="col-md-8 order-md-2 mb-4">
                    <BootstrapTable data={ this.state.table } tableHeaderClass={"thead-dark"} cellEdit={cellEditProp}>
                        <TableHeaderColumn dataField='month' isKey>Mes</TableHeaderColumn>
                        <TableHeaderColumn dataField='consume'>Consumo</TableHeaderColumn>
                        <TableHeaderColumn dataField='production' editable={true}>Producción</TableHeaderColumn>
                        <TableHeaderColumn dataField='pay_before' editable={true}>Pago antes</TableHeaderColumn>
                        <TableHeaderColumn dataField='pay_after' editable={true}>Pago con energía solar</TableHeaderColumn>
                    </BootstrapTable>
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Total</th>
                                    <th scope="col">{this.state.totals[1]}</th>
                                    <th scope="col">{this.state.totals[2]}</th>
                                    <th scope="col">{this.state.totals[3]}</th>
                                    <th scope="col">{this.state.totals[4]}</th>
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
                            <FormControl onChange={this.handleChange} value={this.state.client} id="client" />
                        </InputGroup>

                        <label htmlFor="adress">Direccion</label>
                        <InputGroup className="mb-3">
                            <FormControl id="adress" onChange={this.handleChange} value={this.state.adress}/>
                        </InputGroup>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="city">Ciudad</label>
                                <select onChange={this.handleChangeCity} value={this.state.city} id="city" className="browser-default custom-select">
                                    <option value="hermosillo">Hermosillo</option>
                                    <option value="guaymas">Guaymas</option>
                                    <option value="nogales">Nogales</option>
                                    <option value="obregon">Obregon</option>
                                </select>
                            </div>
                        </div>

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
                                <label htmlFor="tarifa">Tipo de tarifa</label>
                                <select onChange={this.handleChangeSelect} value={this.state.tarifa} id="tarifa" className="browser-default custom-select">
                                    <option value="1">1</option>
                                    <option value="1A">1A</option>
                                    <option value="1B">1B</option>
                                    <option value="1C">1C</option>
                                    <option value="1D">1D</option>
                                    <option value="1E">1E</option>
                                    <option value="1F">1F</option>
                                    <option value="PDBT">PDBT</option>
                                    <option value="GDMTH">GDMTH</option>
                                    <option value="GDMTO">GDMTO</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="sistema_solar">Sistema solar</label>
                                <InputGroup className="mb-3">
                                    <FormControl onChange={this.handleChange} type="number" step="any" id="sistema_solar" />
                                </InputGroup>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="eficiencia">Eficienca</label>
                                <InputGroup className="mb-3">
                                    <FormControl onChange={this.handleChange} type="number" step="any" id="eficiencia" />
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
                        <label htmlFor="inversor">Paneles</label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="panels" type="number"/>
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
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity1" type="number"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description1" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity2" type="number"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description2" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity3" type="number"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description3" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity4" type="number"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description4" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity5" type="number"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description5" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity6" type="number"/>
                    </InputGroup>
                    <InputGroup className="mb-3 col-8">
                        <FormControl onChange={this.handleChange} id="description6" type="text"/>
                    </InputGroup>
                </div>
                <div className="row">
                    <div className="col-2">
                        <label htmlFor="inversor"></label>
                    </div>
                    <InputGroup className="mb-3 col-2">
                        <FormControl onChange={this.handleChange} id="quantity7" type="number"/>
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