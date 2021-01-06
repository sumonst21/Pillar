import { Subject } from 'rxjs';

const subject = new Subject();

export const switches = {
    sendOpen: room => subject.next(room),
    receiveOpen: () => subject.asObservable(), 
    receiveOpenThread: () => subject.asObservable()
};
export const switcheThread = {
    sendOpenThread: message => subject.next(message),
    receiveOpenThread: () => subject.asObservable()
};