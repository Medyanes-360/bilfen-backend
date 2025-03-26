// Öğrenci (kayıt) işlemleri için kullanılan servis
const postAPI = async (
    URL,
    body,
    method = "POST",
    headers = { "Content-Type": "application/json" }
) => {
    try {
        if (!process.env.NEXT_PUBLIC_API_URL || !URL) {
            throw new Error("URL bulunamadı!");
        }
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL + URL}`, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
            cache: "no-store",
            // cache önemli! her çalıştığında cache'deki veri yerine -> güncel veriyi almasını sağlar.
            // bu olmaz ise üncel veriyi almayabiliyor dikkat et.
            // Dinamik sayfalarda burası kullanılıyorsa o sayfalara -> export const dynamic = 'force-dynamic' ekle!
        })
            .then((res) => {
                if (res.url.includes("/notification") && res.redirected) {
                    return (window.location.href = res.url);
                } else {
                    return res.json();
                }
            })
            .catch((err) => console.log(err));

        return data;
    } catch (err) {
        throw new Error(`API request failed: ${err}`);
    }
};

// Öğrenci (kayıt) işlemleri için kullanılan servis
const getAPI = async (
    URL,
    headers = { "Content-Type": "application/json" }
) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL + URL}`, {
        method: "GET",
        headers: headers,
        cache: "no-store",
    })
        .then((res) => {
          
                return res.json();
            
        })
        .catch((err) => console.log(err));

    return data;
};

// DELETE request function
const deleteAPI = async (
    URL,
    headers = { "Content-Type": "application/json" }
) => {
    try {
        if (!process.env.NEXT_PUBLIC_API_URL || !URL) {
            throw new Error("URL bulunamadı!");
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${URL}`, {
            method: "DELETE",
            headers: headers,
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to delete resource");
        }
        if (response.status === 204) return null;
        return response.json();
    } catch (err) {
        throw new Error(`API request failed: ${err}`);
    }
};


// UPDATE request function (using PUT)
const updateAPI = async (
    URL,
    body,
    method = "PUT", // You can also use "PATCH" if partial updates are needed
    headers = { "Content-Type": "application/json" }
) => {
    try {
        if (!process.env.NEXT_PUBLIC_API_URL || !URL) {
            throw new Error("URL bulunamadı!");
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL + URL}`, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error('Failed to update resource');
        }

        return response.json();
    } catch (err) {
        throw new Error(`API request failed: ${err}`);
    }
};

const patchAPI = async (
    URL,
    body,
    headers = { "Content-Type": "application/json" }
) => {
    try {
        if (!process.env.NEXT_PUBLIC_API_URL || !URL) {
            throw new Error("URL bulunamadı!");
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL + URL}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error('Failed to patch resource');
        }

        // Handle 204 No Content response
        if (response.status === 204) return null;

        return response.json();
    } catch (err) {
        throw new Error(`API request failed: ${err}`);
    }
};

export { postAPI, getAPI, deleteAPI, updateAPI, patchAPI };