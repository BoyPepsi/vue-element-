const state = {
    userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '{}'),
    menuList: JSON.parse(sessionStorage.getItem('menuList') || '[]'),
    permsList: JSON.parse(sessionStorage.getItem('permsList') || '[]')
};

export default state;