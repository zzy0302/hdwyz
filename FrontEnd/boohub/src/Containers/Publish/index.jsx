import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Route} from "react-router-dom";
import { List, TextareaItem } from 'antd-mobile';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import { createForm } from 'rc-form';
import category from '../../Data/Category'
import UpNav from '../../Components/UpNav/UpNav';
import testMap from '../../Map.png'
import './publish.css'
import nervos from '../../nervos'
import { transaction, simpleStoreContract } from '../../simpleStore'


class Publish extends Component{
    constructor(props){
        super(props);
        this.state = {
            pictureOnClick: false,
            text: ''
        };
    }


    // state = {
    //     title: '',
    //     contents: '',
    //     category: '',
    //     province: '',
    //     district: '',
    //     street: '',
    //     time: new Date()
    //     // submitText: submitTexts.normal,
    //     // errorText: '',
    // };


    // handleInput = e => {
    //     if(e.id === 'title'){
    //         this.setState({ 'title' : e.value });
    //     }
    //     else if(e.id === 'address'){
    //         this.setState({'province': "上海", 'district': "杨浦", 'street': "四平路"})
    //     }
    //     else if(e.id === 'contents'){
    //         this.setState({'contents': '哇啊啊啊啊啊啊啊啊啊啊啊啊,ball ball you. Please work!!!!!'})
    //     }
    // };

    handleSubmit = () => {
        // const {title, contents, category, province, district, street, time} = this.state;
        // const { getFieldProps } = this.props.form;
        // // TODO: const address = getFieldProps('note2')['value'];
        // const title = getFieldProps('note4')['value'];
        // const contents = getFieldProps('note6')['value'];
        // const category = "吃";
        // const province = '上海';
        // const district = '杨浦';
        // const street = '四平路';
        // alert(title + contents + new Date() + category + province + district + street);

        const { getFieldProps } = this.props.form;
        const title = getFieldProps('note4')['value'];
        const contents = getFieldProps('note6')['value'];
        const category = "吃";
        const province = '上海';
        const district = '杨浦';
        const street = '四平路';
        const time = new Date();
        nervos.appchain
            .getBlockNumber()
            .then(current => {
                const tx = {
                    ...transaction,
                    from:window.neuron.getAccount(),
                    validUntilBlock: +current + 88,
                };
                // this.setState({
                //     submitText: submitTexts.submitting,
                // });
                console.log("add account" + window.neuron.getAccount())
                var that = this;
                simpleStoreContract.methods.addACommentFromMe(title ,contents, category, province, district, street,
                    +time).send(tx, function(err, res) {
                    if (res) {
                        nervos.listeners.listenToTransactionReceipt(res)
                            .then(receipt => {
                                if (!receipt.errorMessage) {
                                    // that.setState({ submitText: submitTexts.submitted })
                                    alert("hello");
                                } else {
                                    throw new Error(receipt.errorMessage)
                                }
                            })
                    } else {
                        // that.setState({ submitText: submitTexts.normal })
                    }
                })
            })
    };

    render(){
        // const {title, contents, category, province, district, street, time} = this.state;
        const { getFieldProps } = this.props.form;
        return(
            <Route>
                <div>
                    <UpNav navname="发表评论"/>
                    <p>
                        <List renderHeader={() => ''}>

                            <TextareaItem
                                {...getFieldProps('note1')}
                                editable={false}
                                title="地址"
                                autoHeight
                                labelNumber={2}
                            />
                            <div id='mapImage'>
                            <img id='map' src={testMap} alt="map" onClick={()=>{this.setState({pictureOnClick: true, text:'上海杨浦四平路'})}}/>
                            </div>
                            <TextareaItem
                                // id = "address"
                                {...getFieldProps('note2')}
                                rows={1}
                                placeholder="请输入地址"
                                value={this.state.text}
                                // value = {time}
                                // onChange={this.handleInput}
                            />
                        </List>

                        <List renderHeader={() => ''}>
                            <TextareaItem
                                {...getFieldProps('note3')}
                                editable={false}
                                title="标题"
                                autoHeight
                                labelNumber={2}
                            />
                            <TextareaItem
                                {...getFieldProps('note4')}
                                rows={1}
                                placeholder="请输入标题"
                                // id = "title"
                                // value = {title}
                                // onChange={this.handleInput}
                            />
                        </List>

                        <List renderHeader={() => ''}>
                            <TextareaItem
                                {...getFieldProps('note5')}
                                editable={false}
                                title="评论内容"
                                autoHeight
                                labelNumber={2}
                            />
                            <TextareaItem
                                {...getFieldProps('note6')}
                                // id = 'contents'
                                rows={5}
                                // value = {contents}
                                // onChange={this.handleInput}
                                placeholder="请输入评论内容"
                            />
                        </List>

                        <WingBlank size="lg">
                            <WhiteSpace size="lg" />
                            <Button type="primary" onClick={this.handleSubmit}>发布评论</Button><WhiteSpace />
                        </WingBlank>
                    </p>
                </div>
            </Route>
        );
    }
}

const PublishItemWrapper = createForm()(Publish);

export default PublishItemWrapper