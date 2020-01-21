/**
 * Ф-ция обработки данных, введённых полозователем. Если обработка будет на фронте,
 * то эту ф-цию надо вызвать в саге
 * Методика расчёта описана в файле гугл-док, ссылка на который приведена в README
 */
export default function shapeTypeDetermination({
    shoulders,
    waist,
    hips,
    height,
  }) {
    /**
     * Ф-ция определения удлинения тела
     * @param {number} shoulders
     * @param {number} height
     */
    function elongationDetermination(
      shoulders,
      height,
    ) {
      // Потребуется уточнить параметры для кажного из полов
      // Эти данные можно сделать в виде параметра
      const elongationFields = [6, 4.5, 3.5]; // [6, 4.5, 3.5, 2.5]
      const elongation = +height / +shoulders;
      // Чем выше категория, тем шире человек
      let categoryByElongation = null;
        if (
          elongation > elongationFields[0] ||
          elongation < elongationFields[elongationFields.length]
        ) {
          return 0;
        }
        elongationFields.reduce((acc, item, index) => {
          if (acc <= item) {
            categoryByElongation = ++index;
          }
          return acc;
        }, elongation);
      
      return categoryByElongation;
    }
  
    /**
     * Ф-ция определения превалирующего размера, определяемого скилетом
     * @param {number} shoulders
     * @param {number} hips
     */
    function majorSizeDetermination(
      shoulders,
      hips,
    ) {
      // Потребуется уточнить параметры для кажного из полов
      // Эти данные можно сделать в виде параметра
      const majorSizeFields = [0.7, 1, 1.2]; // [0.7, 1, 1.2, 1.5]
  
      const hipsProjection = +hips / 3;
      const ratioOfSizes = hipsProjection / shoulders;
  
      // Чем выше категория, тем шире бёдра
      let categoryByMajorSize = null;
        if (
          ratioOfSizes < majorSizeFields[0] ||
          ratioOfSizes > majorSizeFields[majorSizeFields.length]
        ) {
          return 0;
        }
        majorSizeFields.reduce((acc, item, index) => {
          // console.log(acc)
          if (acc >= item) {
            categoryByMajorSize = ++index;
          }
          return acc;
        }, ratioOfSizes);

        return categoryByMajorSize;
    }
  
    /**
     * Определение степени толстоты человека
     * @param {number} shoulders
     * @param {number} waist
     * @param {number} hips
     */
    function degreeOfWidth(
      shoulders,
      waist,
      hips,
    ) {
      // Потребуется уточнить параметры для кажного из полов
      // Эти данные можно сделать в виде параметра
      const degreeOfWidthFields = [1.5, 1.1, 0.8]; // [1.5, 1.1, 0.8, 0.5]
  
      const chest = +shoulders * 3;
      const middleWidth = (+hips + chest) / 2;
      const ratioOfSizes = middleWidth / waist;
      let categoryByDegreeOfWidth = null;
      // Чем выше категория, тем толще талия
        if (
          ratioOfSizes > degreeOfWidthFields[0] ||
          ratioOfSizes < degreeOfWidthFields[degreeOfWidthFields.length]
        ) {
          return 0;
        }
        degreeOfWidthFields.reduce((acc, item, index) => {
          if (acc <= item) {
            categoryByDegreeOfWidth = ++index;
          }
          return acc;
        }, ratioOfSizes);

        return categoryByDegreeOfWidth;
    }
  
    /**
     * Ф-ция определения типа фигуры человека на основе ключевых показателей
     * @param {number} shoulders
     * @param {number} waist
     * @param {number} hips
     * @param {number} height
     * @param {string} sex
     */
    function estimateTypeOfShape(
      shoulders,
      waist,
      hips,
      height,
    ) {
      const categoryByElongation = elongationDetermination(
        shoulders,
        height,
      );

      const categoryByMajorSize = majorSizeDetermination(
        shoulders,
        hips,
      );
      const categoryByDegreeOfWidth = degreeOfWidth(
        shoulders,
        waist,
        hips,
      );

      console.log(categoryByElongation, categoryByMajorSize, categoryByDegreeOfWidth)
  
      // TODO: Написано не оптимально, проверку на сообветствие можно сделать раньше
      let typeOfShape = [];
      typeOfShape.push(categoryByElongation);
      if (
        (categoryByMajorSize === 1 || categoryByMajorSize === 2) &&
        (categoryByDegreeOfWidth === 1 || categoryByDegreeOfWidth === 2)
      ) {
        typeOfShape.push("A");
      } else if (
        categoryByMajorSize === 3 &&
        (categoryByDegreeOfWidth === 1 || categoryByDegreeOfWidth === 2)
      ) {
        typeOfShape.push("B");
      } else if (
        (categoryByMajorSize === 1 ||
          categoryByMajorSize === 2 ||
          categoryByMajorSize === 3) &&
        categoryByDegreeOfWidth === 3
      ) {
        typeOfShape.push("C");
      } else {
        console.log(
          categoryByElongation,
          categoryByMajorSize,
          categoryByDegreeOfWidth
        );
        return "data is not correct";
      }
      return typeOfShape;
    }
    return estimateTypeOfShape(shoulders, waist, hips, height);
  }
  