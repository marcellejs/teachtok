// -----------------------------------------------------------
// Export Data

import { button, textArea } from '@marcellejs/core';

export const commentsArea = textArea('', 'Add Notes');
commentsArea.title = 'Add some comments';

export const exportBtnTrain = button('export data');
exportBtnTrain.title = '';
