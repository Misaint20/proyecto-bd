export async function fetchData(
    apiCall: any,
    setter: any,
    dataName = "datos",
    setLoading?: (v: boolean) => void,
    transform?: (payload: any) => any,
) {
    if (setLoading) setLoading(true);
    try {
        const result = await apiCall();

        if (result && result.success) {
            // Algunas APIs devuelven { data: { data: [...] } } o { data: [...] }
            const payload = result.data?.data ?? result.data ?? [];
            const final = transform ? transform(payload) : payload;
            setter(final);
        } else if (result) {
            console.error(`Error al obtener ${dataName}: ${result.errorMessage}`);
            setter([]);
        } else {
            console.error(`Error: No se pudo obtener respuesta del servicio para ${dataName}.`);
            setter([]);
        }
    } catch (error) {
        console.error(`Error inesperado al intentar obtener ${dataName}:`, error);
        setter([]);
    } finally {
        if (setLoading) setLoading(false);
    }
}

export default fetchData;
