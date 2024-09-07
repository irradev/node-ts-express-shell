import { v4 as uuidv4 } from 'uuid';


export class UuidPlugin {

    static v4 = () => uuidv4();
}