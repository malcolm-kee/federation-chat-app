import { xFetchJson } from '../../lib/ajax';

const GLOBAL_CHATROOM_URL = 'https://ecomm-service.herokuapp.com/chat/room';

export const getGlobalChatRoom = () => xFetchJson(GLOBAL_CHATROOM_URL);
