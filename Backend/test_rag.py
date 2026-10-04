import asyncio

from app.services.rag_service import retrieve_relevant_context


async def main():
    question = "What is the punishment for theft under Indian law?"

    print("esting Supabase PostgreSQL FTS RAG...")
    print("Question:", question)
    print("\nSearching legal documents...\n")

    result = await retrieve_relevant_context(
        query=question,
        category="criminal law",
    )

    if result:
        print("RAG TEST SUCCESS")
        print("=" * 60)
        print(result)
    else:
        print("RAG TEST FAILED")
        print("No legal context was returned.")


if __name__ == "__main__":
    asyncio.run(main())