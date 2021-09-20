////////////////////////
#include "../../common.h"

#include <new>

void* operator new(std::size_t size)
{
    if (size == 0)
        size = 1;
    void* p;
    while ((p = Env::Heap_Alloc(size)) == nullptr)
    {
        break;
    }
    return p;
}

void* operator new(std::size_t size, std::align_val_t alignment)
{
    if (size == 0)
        size = 1;
    if (static_cast<size_t>(alignment) < sizeof(void*))
        alignment = std::align_val_t(sizeof(void*));

    Env::Halt_if(static_cast<size_t>(alignment) != 16);

    void* p;
    while ((p = Env::Heap_Alloc(size)) == nullptr)
    {
        break;
    }
    return p;
}

void operator delete(void* ptr) noexcept
{
    Env::Heap_Free(ptr);
}

void operator delete(void* ptr, std::align_val_t) noexcept
{
    Env::Heap_Free(ptr);
}
//
//extern "C" void* malloc(size_t size)
//{
//    return Env::Heap_Alloc(size);
//}
//
//extern "C" void free(void* ptr)
//{
//    Env::Heap_Free(ptr);
//}

extern "C" size_t strlen(const char* s)
{
    return static_cast<size_t>(Env::Strlen(s));
}

extern "C" int strcmp(const char* lhs, const char* rhs)
{
    return Env::Strcmp(lhs, rhs);
}

extern "C" void abort()
{
    Env::Halt();
}

extern "C" void* memcpy(void* dest, const void* src, size_t n)
{
    Env::Memcpy(dest, src, n);
    return dest;
}

extern "C" void* memset(void* dest, int ch, size_t count)
{
    Env::Memset(dest, ch, count);
    return dest;
}

extern "C" int memcmp(const void* lhs, const void* rhs, size_t count)
{
    return Env::Memcmp(lhs, rhs, count);
}

namespace std
{
    void terminate() noexcept
    {
        ::abort();
    }
}



