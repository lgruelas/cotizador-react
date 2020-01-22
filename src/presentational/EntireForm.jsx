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
            anual: "25 años",
            sistema_solar: "",
            eficiencia: "",
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
            table: [
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
            ],
            totals: ["0.00", "0.00", "0.00", "0.00", "0.00"],
            tarifa: "1"
        }
        this.pay_before_temps = pay_before_temp_costs_domestic_1;
        console.log(this.pay_before_table)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
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
        to_send.totals = this.state.totals.map(e => ({...e}))

        this.format_output(to_send);
        axios.post(`https://57d3a4c2.ngrok.io/generate`, to_send, {
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
        if (e.target.id === 'quote' ) {
            for (let i = 1; i <= 5; i++) {
                this.setState({[`${e.target.id}${i}`]: `No. de cotización: ${e.target.value}`});
            }
        } else {
            this.setState({[e.target.id]: e.target.value});
        }
    }

    calculateProduction(row, new_totals) {
        if (this.state.sistema_solar && this.state.eficiencia) {
            let new_value = "";
            new_value = Math.round(parseFloat(row["hours"])*parseFloat(this.state.sistema_solar)*parseFloat(this.state.eficiencia)*31);
            new_totals[2] = this.calculateNewTotal("production", row.month, new_value);
            if (row.pay_before) {
                let payAfter = this.calculatePayAfter(row, row.pay_before, new_value);
                new_totals[4] = this.calculateNewTotal("pay_after", row.month, payAfter);
                this.setState(oldState => ({
                    totals: new_totals,
                    table: oldState.table.map(
                        el => el.month === row.month? { ...el, production: new_value , pay_after: payAfter }: el
                    )
                }));
            } else {
                this.setState(oldState => ({
                    totals: new_totals,
                    table: oldState.table.map(
                        el => el.month === row.month? { ...el, production: new_value }: el
                    )
                }));
            }
        } else {
            this.setState({totals: new_totals});
        }
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
        new_totals[3] = this.calculateNewTotal("pay_before", row.month, new_value);
        if (row.production) {
            let payAfter = this.calculatePayAfter(row, new_value, row.production);
            new_totals[4] = this.calculateNewTotal("pay_after", row.month, payAfter);
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
        console.log(row)
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
        console.log(to_pay)
        return pay_before - Math.round(to_pay);
    }

    calculateNewTotal(column, month, value) {
        month = month || "not_assigned";
        let total = 0;
        this.state.table.forEach(element => {
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
        let total = this.calculateNewTotal(column);
        switch(column) {
            case 'hours':
                new_totals[0] = (total/12.0).toFixed(2);
                this.calculateProduction(row, new_totals);
                break;
            case 'consume':
                new_totals[1] = (total).toFixed(2);
                this.calculatePayBefore(row, new_totals);
                break;
        }
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
                        <TableHeaderColumn dataField='hours'>Horas de irradiación</TableHeaderColumn>
                        <TableHeaderColumn dataField='consume'>Consumo</TableHeaderColumn>
                        <TableHeaderColumn dataField='production' editable={false}>Producción</TableHeaderColumn>
                        <TableHeaderColumn dataField='pay_before' editable={false}>Pago antes</TableHeaderColumn>
                        <TableHeaderColumn dataField='pay_after' editable={false}>Pago con energía solar</TableHeaderColumn>
                    </BootstrapTable>
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Total</th>
                                    <th scope="col">{this.state.totals[0]}</th>
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
                                    <FormControl onChange={this.handleChange} id="sistema_solar" />
                                </InputGroup>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="eficiencia">Eficienca</label>
                                <InputGroup className="mb-3">
                                    <FormControl onChange={this.handleChange} id="eficiencia" />
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