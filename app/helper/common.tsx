import git from 'git-last-commit';

const handleGitUpdate = () => {
  return new Promise(resolve => {
    git.getLastCommit(function(err, commit) {
      resolve(commit);
    });
  });
};

const isTouchScreen = () => {
  if ('ontouchstart' in document.documentElement) {
    return true;
  }
  return false;
};

const saveToStorage = (key, value) => {
  return localStorage.setItem(key, value);
};

const getStorage = key => {
  return localStorage.getItem(key);
};

const checkConstantAdjustTime = value => {
  const isMinus = value && value.toString().includes('-')
  if (isMinus) {
    const strValue = value.toString().replace('-', '');
    return {
      isAdd: false,
      addTime: Number(strValue)
    };
  }
  return {
    isAdd: true,
    addTime: Number(value)
  };
};

export {
  handleGitUpdate,
  isTouchScreen,
  saveToStorage,
  getStorage,
  checkConstantAdjustTime
};
