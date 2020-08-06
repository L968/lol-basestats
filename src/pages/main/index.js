import React, { Component } from 'react';
import axios from '../../services/api';

import Chart from '../../components/Chart';
import Select from 'react-select';

import './styles.css';

export default class Main extends Component {

    state = {
        patchs: [],
        selectedPatch: '',
        selectedChampions: [],
        championsData: {}
    }

    async componentDidMount() {
        await this.loadPatchs();
        await this.loadChampionsData();
    }

    loadPatchs = async () => {
        const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');

        const patchs = response.data;

        this.setState({
            patchs: patchs,
            selectedPatch: patchs[0]
        });
    }

    loadChampionsData = async () => {
        const { selectedPatch } = this.state;

        if (selectedPatch) {
            const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${selectedPatch}/data/en_US/champion.json`);

            this.setState({
                championsData: response.data.data
            });

            console.log(this.state.championsData);
        }
    }

    onChangePatch = (value) => {
        if (this.state.selectedPatch !== value) {
            this.setState({ selectedPatch: value }, () => {
                this.loadChampionsData();
            });
        }
    }

    onChangeChampion = (champions) => {
        if (champions) {
            const selectedChampions = champions.map(champion => champion.value);

            this.setState({ selectedChampions });
        } else {
            this.setState({ selectedChampions: [] });
        }
    }

    render() {
        const { patchs, selectedPatch, championsData, selectedChampions } = this.state;

        const champions = Object.entries(championsData);
        const selectedChampionsData = champions.filter(champion => selectedChampions.includes(champion[0]));

        const patchOptions = patchs.map(patch => ({ value: patch, label: patch }));
        const championOptions = champions.map(champion => ({ value: champion[1].name, label: champion[1].name }));

        return (
            <div className="main">
                <header className="container">
                    <div className="row">
                        <Select
                            className="col-2"
                            placeholder="Patch"
                            value={{ value: selectedPatch, label: selectedPatch }}
                            options={patchOptions}
                            onChange={option => this.onChangePatch(option.value)}
                        />

                        <Select
                            className="col-10"
                            placeholder="Select a champion..."
                            isMulti
                            closeMenuOnSelect={false}
                            options={championOptions}
                            onChange={champions => this.onChangeChampion(champions)}
                        />
                    </div>
                </header>

                <Chart selectedChampionsData={selectedChampionsData} />
            </div>
        );
    }
}