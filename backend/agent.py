"""Travel agent logic using Google Gemini and Tavily search."""


import google.generativeai as genai
from tavily import TavilyClient

from config import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# Initialize Tavily client
tavily_client = TavilyClient(api_key=settings.TAVILY_API_KEY)


def search_travel_info(query: str) -> str:
    """Search for real-time travel information using Tavily.

    Searches for flights, hotels, attractions, weather, and other
    travel-related information relevant to the user's query.

    Args:
        query: The travel-related search query.

    Returns:
        str: Formatted search results as a string.

    Raises:
        Exception: If the Tavily search fails.
    """
    search_queries = [
        f"{query} travel guide",
        f"{query} flights and hotels prices",
        f"{query} top attractions and activities",
        f"{query} weather and best time to visit",
    ]

    all_results = []
    for search_query in search_queries:
        try:
            response = tavily_client.search(
                query=search_query,
                max_results=3,
                search_depth="basic",
            )
            for result in response.get("results", []):
                all_results.append(
                    {
                        "title": result.get("title", ""),
                        "content": result.get("content", ""),
                        "url": result.get("url", ""),
                    }
                )
        except Exception:
            # Continue with other searches if one fails
            continue

    if not all_results:
        return "No search results found. Please generate a plan based on general knowledge."

    formatted_results = []
    for i, result in enumerate(all_results, 1):
        formatted_results.append(
            f"[{i}] {result['title']}\n{result['content']}\nSource: {result['url']}"
        )

    return "\n\n".join(formatted_results)


def generate_travel_plan(query: str) -> str:
    """Generate a comprehensive travel plan using Gemini AI and Tavily search.

    This function:
    1. Uses Tavily to search for real-time travel information
    2. Passes search results along with the user query to Gemini
    3. Returns a structured travel plan

    Args:
        query: The user's travel query (e.g., "Plan a 5 day trip to Bali on a $2000 budget").

    Returns:
        str: A structured travel plan including destination overview,
             day-by-day itinerary, estimated costs, and tips.

    Raises:
        Exception: If plan generation fails.
    """
    # Step 1: Search for real-time travel information
    search_results = search_travel_info(query)

    # Step 2: Build the prompt for Gemini
    system_prompt = """You are an expert travel planning assistant. Your job is to create 
detailed, practical, and well-structured travel plans based on user queries and real-time 
search results.

Your response MUST be structured with the following sections:

## 🌍 Destination Overview
A brief introduction to the destination, including key highlights and what makes it special.

## 📅 Day-by-Day Itinerary
A detailed day-by-day plan with specific activities, places to visit, and time suggestions.

## 💰 Estimated Costs
A breakdown of estimated costs including:
- Flights (round trip)
- Accommodation (per night and total)
- Food (daily estimate)
- Activities and entrance fees
- Transportation within the destination
- Total estimated budget

## 💡 Travel Tips
Practical tips including:
- Best time to visit
- Local customs and etiquette
- Must-try local food
- Safety tips
- Packing suggestions
- Money-saving tips

Use the search results provided to give accurate, up-to-date information. If search results 
are limited, supplement with your general knowledge but clearly indicate when you're doing so.
Format the response in clear markdown."""

    user_prompt = f"""User's travel query: {query}

Here are real-time search results to help create an accurate plan:

{search_results}

Please create a comprehensive travel plan based on the above query and search results."""

    # Step 3: Generate the plan using Gemini
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=system_prompt,
    )

    response = model.generate_content(user_prompt)

    if not response.text:
        raise ValueError("Gemini returned an empty response.")

    return response.text
