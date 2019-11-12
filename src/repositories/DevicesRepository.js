import axios from 'axios';
import _ from 'lodash';

class DevicesRepository {

    constructor(developers, types) {
        this.developers = developers;
        this.types = types;
    }

    async findAll() {
        let devicesToLoad = [];
        for (let developer of this.developers) {
            const { data } = await axios.get(`/db/${developer}.json`);
            const { unofficial, official } = data;
            official.forEach(device => {
                device.developer = developer;
                device.type = this.getType(device.name);
                device.official = true;
            });
            unofficial.forEach(device => {
                device.developer = developer;
                device.type = this.getType(device.name);
                device.official = false;
            });
            devicesToLoad = [...devicesToLoad, ...unofficial, ...official];
        }
        return devicesToLoad;
    }

    getType(name) {
        for(let type in this.types) {
            let found = false;
            const searchStrings = this.types[type];
            for(let search of searchStrings) {
                if(_.toLower(name).includes(search)){
                    found = true;
                    break;
                }
            }
            if(found) {
                return type;
            }
        }
        return 'unknown';
    }

}

export default DevicesRepository;