/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from '@testing-library/dom';

import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import router from '../app/Router.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store';

// NEWBILL
describe('Given I am a user connected as Employee', () => {
  // Test fonctionnel mais n'augmente pas le coverage global du composant
  describe('When I navigate to NewBill page', () => {
    // test('Then email icon in vertical layout should be highlighted', async () => {
    //   Object.defineProperty(window, 'localStorage', {
    //     value: localStorageMock
    //   });
    //   localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
    //   const root = document.createElement('div');
    //   root.setAttribute('id', 'root');
    //   document.body.append(root);
    //   router();
    //   window.onNavigate(ROUTES_PATH.NewBill);
    //   await waitFor(() => screen.getByTestId('icon-mail'));
    //   const windowIcon = screen.getByTestId('icon-mail');
    //   const iconActive = windowIcon.classList.contains('active-icon');
    //   expect(iconActive).toHaveClass;
    // });
  });

  // Test fonctionnel mais n'augmente pas le coverage global du composant
  // NEW
  describe('When I submit a new Bill', () => {
    // Vérifie que le bill se sauvegarde
    // test('Then must save the bill', async () => {
    //   Object.defineProperty(window, 'localStorage', {
    //     value: localStorageMock
    //   });
    //   window.localStorage.setItem(
    //     'user',
    //     JSON.stringify({
    //       type: 'Employee'
    //     })
    //   );

    //   const onNavigate = (pathname) => {
    //     document.body.innerHTML = ROUTES({ pathname });
    //   };

    //   document.body.innerHTML = NewBillUI();

    //   const newBill = new NewBill({
    //     document,
    //     onNavigate,
    //     store: null,
    //     localStorage: window.localStorage
    //   });

    //   const newBillForm = screen.getByTestId('form-new-bill');
    //   expect(newBillForm).toBeTruthy();

    //   const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
    //   newBillForm.addEventListener('submit', handleSubmit);
    //   fireEvent.submit(newBillForm);
    //   expect(handleSubmit).toHaveBeenCalled();
    // });

    test('Then show the new bill page', async () => {
      localStorage.setItem(
        'user',
        JSON.stringify({ type: 'Employee', email: 'e@e' })
      );
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
    });

    // Test Integration POST a new file
    // When I load a file in the file input
    test('Then trigger create a file in store)', async () => {
      const onNavigate = () => {};

      jest.spyOn(mockStore, 'bills');

      const spyCreate = jest.fn(() => {
        return Promise.resolve({});
      });

      mockStore.bills.mockImplementationOnce(() => {
        return {
          create: spyCreate
        };
      });

      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage
      });

      const mockEvent = {};

      mockEvent.preventDefault = jest.fn();

      mockEvent.target = { value: 'OK.png' };

      const fileInput = screen.getByTestId('file');

      const file = new File(['test'], 'test.png', { type: 'image/png' });

      await userEvent.upload(fileInput, file);

      await newBillContainer.handleChangeFile(mockEvent);

      expect(spyCreate).toHaveBeenCalled();
    });

    // Vérifie si un fichier est bien chargé
    test('Then verify the file bill', async () => {
      jest.spyOn(mockStore, 'bills');

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      });
      Object.defineProperty(window, 'location', {
        value: { hash: ROUTES_PATH['NewBill'] }
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee'
        })
      );

      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      });

      //création de l'objet file
      const file = new File(['File'], 'File.png', {
        type: 'image/png'
      });

      // création d'une fonction espion me permettant d'appeler la méthode handleChangeFile de l'objet newBill
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

      const proof = screen.getByTestId('file');
      proof.addEventListener('change', handleChangeFile);
      //simule l'upload d'un fichier en utilisant l'objet userEvent
      userEvent.upload(proof, file);
      expect(proof.files[0].name).toBeDefined();
      expect(handleChangeFile).toBeCalled();

      // création d'une fonction espion me permettant d'appeler la méthode handleSubmit de l'objet newBill
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      const formNewBill = screen.getByTestId('form-new-bill');
      formNewBill.addEventListener('submit', handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  // Test fonctionnel mais n'augmente pas le coverage global du composant
  describe('When I upload an unaccepted format of file in a new Bill', () => {
    // test('Then verify the submit button iswill be disabled.', async () => {
    //   Object.defineProperty(window, 'localStorage', {
    //     value: localStorageMock
    //   });
    //   Object.defineProperty(window, 'location', {
    //     value: { hash: ROUTES_PATH['NewBill'] }
    //   });
    //   window.localStorage.setItem(
    //     'user',
    //     JSON.stringify({
    //       type: 'Employee'
    //     })
    //   );
    //   const html = NewBillUI();
    //   document.body.innerHTML = html;
    //   const file = new File(['imageFile'], 'imageFile.gif', {
    //     type: 'image/gif'
    //   });
    //   window.onNavigate(ROUTES_PATH.NewBill); //chargement de l'écran
    //   const fileInput = screen.getByTestId('file');
    //   const submitButton = document.getElementById('btn-send-bill');
    //   console.log('submitButton', submitButton);
    //   const alertMock = jest.spyOn(window, 'alert');
    //   userEvent.upload(fileInput, file);
    //   await waitFor(() => {
    //     const submitButton = document.getElementById('btn-send-bill');
    //     expect(submitButton).toBeDisabled();
    //     expect(alertMock).toHaveBeenCalledWith(
    //       "Les formats de fichiers autorisés pour le justificatif sont les suivants : 'jpg', 'jpeg', 'png' "
    //     );
    //   });
    // });
  });
});
