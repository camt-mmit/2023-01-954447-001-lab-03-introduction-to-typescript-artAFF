import { createComponent } from './input-component.js';

export function createSectionComponent(componentElement: HTMLElement) {
  const tempInput = componentElement.querySelector<HTMLTemplateElement>(
    'template.app-temp-section',
  );

  if (tempInput === null) {
    throw new Error(`Cannot find input template`);
  }

  const inputList = tempInput.parentElement;

  if (inputList === null) {
    throw new Error(`Cannot find list container`);
  }

  const updateList = () => {
    const children = [...inputList.children].filter(
      (elem) => elem !== tempInput,
    );

    children.forEach((element, i) => {
      [
        ...element.querySelectorAll<HTMLInputElement>(
          '.app-cmp-add-section-no',
        ),
      ].forEach((elem) => {
        elem.textContent = `${i + 1}`;
      });
    });

    [
      ...inputList.querySelectorAll<HTMLInputElement>(
        '.app-cmd-remove-section',
      ),
    ].forEach((elem) => (elem.disabled = children.length === 1));
  };

  const createElement = () => {
    const container = (tempInput.content.cloneNode(true) as DocumentFragment)
      .firstElementChild as HTMLElement | null;

    if (container == null) {
      throw new Error(`Cannot find template container`);
    }

    container.addEventListener('click', (ev) => {
      if ((ev.target as Element | null)?.matches('.app-cmd-remove-section')) {
        (ev.currentTarget as Element | null)?.remove();
        updateList();
      }
    });

    createComponent(container);

    return container;
  };

  componentElement.addEventListener('click', (ev) => {
    if ((ev.target as Element | null)?.matches('.app-cmp-add-section')) {
      inputList.append(createElement());
      updateList();
    }
  });

  inputList.append(createElement());
  updateList();
}

// npx http-server -c0 ()
