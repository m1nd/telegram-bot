export default function shapeTypeDetermination({
		backWidth,
    waistWidth,
    hipsWidth,
		height,
		scaleOfFat,
		sex,
  }) {
// Все ширины из обхватов - получаются делением обхвата на три

    /**
     * 
     * @param {number} backWidth принимает ширину спины (или груди)
     * @param {number} hipsWidth принимает ширину бёдер. Сама её не высчитывает
     */
    function M_determination(backWidth, hipsWidth) {
				const m = hipsWidth / backWidth
				
        if ( m <= 0.9) return 'A'
        if ( m > 0.9 && m < 1.1) return 'B'
        if ( m >= 1.1) return 'C'
    }

    /**
     * 
     * @param {*} backWidth 
     * @param {*} waistWidth 
     * @param {*} hipsWidth 
     */
    function waistParams_determination(backWidth, waistWidth, hipsWidth) {
        const middleWaist = (backWidth + hipsWidth)/2
        const s = middleWaist/waistWidth
        const params = {
            isWaistVerySmall: s > 1.35, // Дополнительный параметр для учёта чрезвычайно узкой бабьей талии
        }
        if ( s >= 1.2 ) params.s = '1'
        if ( s < 1.2 && s >= 0.95 ) params.s = '2'
        if ( s < 0.95 ) params.s = '3'
        return params
    }

    /**
     * 
     * @param {number} m 
     * @param {number} s 
     * @param {number} scaleOfFat номер выбранной картинки полноты
     */
    function appearance_determination(m, s, scaleOfFat) {
        const appearance_types = {
            A: {
                1: '1',
                2: '1',
                3: '5',
            },
            B: {
                1: '2',
                2: '3',
                3: '5',
            },
            C: {
                1: '4',
                2: '4',
                3: '5',
            },
        }

        return {
            appearance_type: appearance_types[m][s],
            isFat: scaleOfFat > 3,
        }
    }

    /**
     * 
     * @param {number} backWidth 
     * @param {number} height 
     */
    function U_determination(backWidth, height) {
        const u = height/backWidth
        if ( u >= 5 ) return '1'
        if ( u < 5 && u > 4 ) return '2'
        if ( u <= 4 ) return '3'   
    }

		return ({
			isWaistVerySmall: waistParams_determination(backWidth, waistWidth, hipsWidth).isWaistVerySmall,
			...appearance_determination(
					M_determination(backWidth, hipsWidth), 
					scaleOfFat,
					waistParams_determination(backWidth, waistWidth, hipsWidth).s, 
			),
			u: U_determination(backWidth, height),
			height,
			sex,
			// tits
	})
}