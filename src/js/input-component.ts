export function createComponent(componentElement: HTMLElement) {
  const tempInput = componentElement.querySelector<HTMLTemplateElement>("template.app-temp-input");

  if(tempInput === null) {
    throw new Error(`Cannot find input template`);
  }

  const inputList = tempInput.parentElement;

  if(inputList === null) { 
    throw new Error(`Cannot find list container`);
  }

  const updateResult = () => {
    const children = [...inputList.children].filter(
      (elem) => elem !== tempInput
    );

    const result = children.reduce(
      (carry, element) =>
        carry +
        (element.querySelector<HTMLInputElement>('input[type="number"].app-cmp-input')?.valueAsNumber ?? 0),
      0,
    );

    [...componentElement.querySelectorAll<HTMLOutputElement>('output.app-cmp-result')].forEach(
      (elem) => (elem.value = `${result.toLocaleString()}`),
    );
  };

  const updateList = () => {
    updateResult();

    const children = [...inputList.children].filter(
      (elem) => elem !== tempInput
    );

    children.forEach((element, i) => {
      [...element.querySelectorAll(".app-cmp-input-no")].forEach((elem) => {
        elem.textContent = `${i + 1}`;
      });
    });

    [...inputList.querySelectorAll<HTMLElement & { disabled: boolean}>(".app-cmd-remove-input")].forEach(
      (elem) => (elem.disabled = children.length === 1)
    );
  };

  const createElement = () => {
    const container = (tempInput.content.cloneNode(true) as DocumentFragment).firstElementChild;
    
    if(container ==null) {
      throw new Error(`Cannot find template container`);
    }

    container.addEventListener("click", (ev) => {
      if ((ev.target as Element | null)?.matches(".app-cmd-remove-input")) {
        container.remove();
        updateList();
      }
    }); 
    return container;
  };

  componentElement.addEventListener("click", (ev) => {
    if ((ev.target as Element | null)?.matches(".app-cmp-add-input")) {
      inputList.append(createElement());
      updateList();
    }
  });

  inputList.addEventListener("change", (ev) => {
    if ((ev.target as Element | null)?.matches('input[type="number"].app-cmp-input')) {
      updateResult();
    }
  });

  inputList.append(createElement());
  updateList();
}