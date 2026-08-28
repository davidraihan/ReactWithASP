export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`
    try {
      const errorData = await response.json()
      if (typeof errorData === 'string') errorMsg = errorData
      else if (errorData.message) errorMsg = errorData.message
      else if (Array.isArray(errorData)) errorMsg = errorData.join(', ')
    } catch {
      const text = await response.text()
      if (text) errorMsg = text
    }
    throw new Error(errorMsg)
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}
