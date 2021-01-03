import { Subject } from 'rxjs';

const subject = new Subject();

export const switches = {
    sendOpen: room => subject.next(room ),
    clear: () => subject.next(),
    receiveOpen: () => subject.asObservable()
};