// type params = {
//     shoulders: number;
//     chest: number;
//     waist: number;
//     hips: number;
//     height: number;
//     sex: string;
//   };
  
  const listOfSizesByChest_M = [93, 97, 101, 105, 109, 113]; // XS, S, M, L, XL, XXL
  const listOfSizesByChest_F = [81, 89, 97, 107, 119, 131];
  const listOfSizeByHips_M = [104, 108, 112, 116, 120, 124];
  const listOfSizeByHips_F = [89, 97, 104, 112, 122, 134];
  
  const namesOfChestSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  
  function sizeEstimating(
    sex,
    checkingParam, // number
    listsOfSizes  // { male: number[]; female: number[] }
  ) {
    // Осторожно! Код ниже не оптимален
    let size = namesOfChestSizes[0];
    if (sex === "m") {
      listsOfSizes.male.forEach((item, index) => {
        if (checkingParam > item) {
          size = namesOfChestSizes[index];
        }
      });
    } else {
      listsOfSizes.female.forEach((item, index) => {
        if (checkingParam > item) {
          size = namesOfChestSizes[index];
        }
      });
    }
    return size;
  }
  
  export default function({ chest, hips, height, sex }) {
    // Рост здесь передавался из предположения, что его тоже не плохо бы приводить к дискретным параметрам, сделав к функциям ниже ещё одну
    const sizeOfChest = sizeEstimating(sex, chest, {
      male: listOfSizesByChest_M,
      female: listOfSizesByChest_F
    });
    const sizeOfHips = sizeEstimating(sex, hips, {
      male: listOfSizeByHips_M,
      female: listOfSizeByHips_F
    });
  
    return {
      sizeOfChest: sizeOfChest,
      sizeOfHips: sizeOfHips,
      height: height
    };
  }
  